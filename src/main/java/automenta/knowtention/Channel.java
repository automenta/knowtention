package automenta.knowtention;

import com.fasterxml.jackson.databind.JsonNode;
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
    
    public ObjectNode node;
    public final String id;

    public Channel(String id) {
        this.id = id;
        this.node = JsonNodeFactory.instance.objectNode();
        this.node.put("id", id);
    }
    
    public Channel(ObjectNode node) {
        this.node = node;
        this.id = node.get("id").asText();
    }

    @Override
    public String toString() {
        return node.toString();
    }

    void applyPatch(JsonPatch patch) throws JsonPatchException {
        node = (ObjectNode) patch.apply(node);
    }
    
    
    
    
}
