package automenta.knowtention;

import automenta.knowtention.EventEmitter.EventObserver;
import com.fasterxml.jackson.databind.node.JsonNodeFactory;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.github.fge.jsonpatch.JsonPatch;
import com.github.fge.jsonpatch.JsonPatchException;
import java.io.Serializable;

/**
 * Holds working data in the form of a JSON symbol tree
 * @see https://github.com/fge/json-patch
 */
public class Channel implements Serializable {
    
    public abstract static class ChannelChange implements EventObserver {  

        @Override  public void event(Class event, Object[] args) {
            event((Channel)args[0], (JsonPatch)args[1]);
        }
        
        abstract public void event(Channel c, JsonPatch p);
        
    }
    
    public ObjectNode node;
    public final String id;
    transient private Core core;

    public Channel(Core core, String id) {
        this.id = id;
        this.core = core;
        this.node = JsonNodeFactory.instance.objectNode();
        this.node.put("id", id);
    }
    
    public Channel(Core core, ObjectNode node) {
        this.node = node;
        this.core = core;
        this.id = node.get("id").asText();
    }

    @Override
    public String toString() {
        return node.toString();
    }

    void applyPatch(JsonPatch patch) throws JsonPatchException {
        node = (ObjectNode) patch.apply(node);
        core.emit(ChannelChange.class, this, patch);
    }
    
    
    
    
}
