package automenta.knowtention;

import automenta.knowtention.EventEmitter.EventObserver;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.JsonNodeFactory;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.github.fge.jsonpatch.JsonPatch;
import com.github.fge.jsonpatch.JsonPatchException;
import java.io.IOException;
import java.io.Serializable;
import java.util.logging.Level;
import java.util.logging.Logger;

/**
 * Holds working data in the form of a JSON symbol tree
 * @see https://github.com/fge/json-patch
 */
public class Channel extends EventEmitter implements Serializable {

    
    public abstract static class ChannelChange implements EventObserver {  

        @Override  public void event(Class event, Object[] args) {
            event((Channel)args[0], (JsonPatch)args[1]);
        }
        
        abstract public void event(Channel c, JsonPatch p);
        
    }
    
    protected ObjectNode node;
    public final String id;
    transient private Core core;

    public Channel(Core core, String id) {
        super();
        this.id = id;
        this.core = core;
        this.node = JsonNodeFactory.instance.objectNode();
        this.node.put("id", id);
    }
    
    public Channel(Core core, ObjectNode node) {
        super();
        this.node = node;
        this.core = core;
        this.id = node.get("id").asText();
    }

    @Override
    public String toString() {
        return node.toString();
    }

    void applyPatch(JsonPatch patch) throws JsonPatchException {
        setNode( (ObjectNode) patch.apply(node) );
        core.emit(ChannelChange.class, this, patch);
    }
    
    public Channel setNode(ObjectNode newValue) {
        //set or overwrite the 'id' field
        newValue.put("id", id);
        
        this.node = newValue;
        
        emit(ChannelChange.class);
        
        return this;
    }
    
    public Channel setNode(String jsonContent) {
        try {
            
            setNode( Core.json.readValue(jsonContent, ObjectNode.class) );
            
        } catch (IOException ex) {
            ex.printStackTrace();
        }
        return this;
    }

    public ObjectNode getNode() {
        return node;
    }
    
    
    public JsonNode getSnapshot() {
        return getNode();
    }
    
    
}
