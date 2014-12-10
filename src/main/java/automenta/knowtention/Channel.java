package automenta.knowtention;

import automenta.knowtention.EventEmitter.EventObserver;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.JsonNodeFactory;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.github.fge.jsonpatch.JsonPatch;
import com.github.fge.jsonpatch.JsonPatchException;
import com.github.fge.jsonpatch.diff.JsonDiff;
import java.io.IOException;
import java.io.Serializable;

/**
 * Holds working data in the form of a JSON symbol tree
 * @see https://github.com/fge/json-patch
 */
public class Channel extends EventEmitter implements Serializable {
    
    private JsonNode prev;
    private boolean inTransaction;

    
    public abstract static class ChannelChange implements EventObserver {  

        @Override  public void event(Class event, Object[] args) {
            event((Channel)args[0], (JsonPatch)args[1]);
        }
        
        abstract public void event(Channel c, JsonPatch p);
        
    }
    
    protected ObjectNode root;
    public final String id;
    transient private Core core;

    public Channel(Core core, String id) {
        super();
        this.id = id;
        this.core = core;
        this.root = JsonNodeFactory.instance.objectNode();
        this.root.put("id", id);
    }
    
    public Channel(Core core, ObjectNode node) {
        super();
        this.root = node;
        this.core = core;
        this.id = node.get("id").asText();
    }

    @Override
    public String toString() {
        return root.toString();
    }

    synchronized void applyPatch(JsonPatch patch) throws JsonPatchException {
        set((ObjectNode) patch.apply(root) );
    }
    
    synchronized public Channel set(ObjectNode newRoot) {
        
        tx(new Runnable() {
            @Override public void run() {
                root = newRoot;
            }            
        });

        return this;
    }
    
    public Channel setNode(String jsonContent) {
        try {
            
            set( Core.json.readValue(jsonContent, ObjectNode.class) );
            
        } catch (IOException ex) {
            ex.printStackTrace();
        }
        return this;
    }

    public ObjectNode get() {
        return root;
    }
    
    
    public JsonNode getSnapshot() {
        return get().deepCopy();
    }
    
    /** add vertex */
    public boolean addVertex(ObjectNode vertex) {
        if (vertex == null) return false;
        
        if (!get().has("nodes")) {
            get().put("nodes", Core.newJson.arrayNode());
        }
            
        ArrayNode node = (ArrayNode) get().get("nodes");
        node.add(vertex);
        
        commit();
        return true;
    }
    
    public void addEdge(ObjectNode edge) {
        
    }
    
    /* patch may be null */
    protected void emitChange(JsonNode patch) {
        get().put("id",id);
        
        core.emit(ChannelChange.class, this, patch);
        emit(ChannelChange.class, this, patch);
    }
    
    /** begin transaction */
    public synchronized void tx(Runnable r) {
        
        inTransaction = true;
        
        //save snapshot
        if (get()!=null)
            prev = getSnapshot();
        else
            prev = null;
        
        r.run();
        
        inTransaction = false;
        
        commit();
        
    }
    
    
    /** end transaction */
    public synchronized void commit() {
        if (inTransaction)
            return;
        
        JsonNode patch = null;
        
        if (prev!=null) {            
            patch = JsonDiff.asJson(prev, get());
            prev = null;
        }
        
        //dont emit if patch is empty
        if (patch!=null && patch.size() == 0)
            return;
        
        emitChange(patch);
    }
    
}
