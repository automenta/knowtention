/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package automenta.knowtention;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.JsonNodeFactory;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.github.fge.jsonpatch.JsonPatch;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

/**
 *
 */
public class Core extends EventEmitter {




    final Map<String, Channel> channels = new HashMap();
    
    public Core() {
        super();
        
        Channel index = newChannel("index");
        //index.setNode("{ 'channels': [ 'a', 'b', 'c' ], 'users': [ 'x', 'y', 'z' ]  }");
        
    }
    
    /** default, generic anonymous channel */
    public Channel newChannel() {
        return newChannel( newChannelID() );
    }
    
    public Channel newChannel(String id) {
        Channel c = new Channel( this, id );
        channels.put(c.id, c);
        return c;
    }
    
    String newChannelID() {
        return UUID.randomUUID().toString();
    }

    public Channel getChannel(String id) {
        return getChannel(null, id);
    }
    
    public Channel getChannel(WebSocketConnector.WebSocketConnection socket, String id) {
        Channel c = channels.get(id);
        
        //TODO check security permission
        
        if (c == null) {
            c = new Channel( this, id );
            channels.put(id, c);
        }
        
        return c;
    }
    
    final public static ObjectMapper json = new ObjectMapper()
            .disable(SerializationFeature.FAIL_ON_EMPTY_BEANS)
            .configure(JsonParser.Feature.ALLOW_SINGLE_QUOTES, true)            
            .configure(JsonGenerator.Feature.QUOTE_FIELD_NAMES, true)
            .configure(JsonGenerator.Feature.ESCAPE_NON_ASCII, true)
            .configure(JsonParser.Feature.ALLOW_UNQUOTED_FIELD_NAMES, true);
    
    final public static JsonNodeFactory newJson = new JsonNodeFactory(false);
    
    public static String toJSON(Object o) {
        try {
            return json.writeValueAsString(o);
        } catch (JsonProcessingException ex) {
            System.out.println(ex.toString());
            try {
                return json.writeValueAsString( o.toString() );
            } catch (JsonProcessingException ex1) {
                return null;
            }
        }
    }

    public static ObjectNode fromJSON(String x) {
        try {
            
            return json.readValue(x, ObjectNode.class);
        } catch (IOException ex) {
            ex.printStackTrace();
            return null;
        }
    }

    
    /** adapter for JSONPatch+ */
    static JsonPatch getPatch(ArrayNode patch) throws IOException {
        

        //System.out.println("min: " + patch.toString());
        
        /*
        
            JSONPatch+
        
            [ [ <op>, <param1>[, <param2> ], .... ]

            + add
            - remove
            * copy
            / move
            = replace
            ? test
        
            [
              { "op": "test", "path": "/a/b/c", "value": "foo" },
              { "op": "remove", "path": "/a/b/c" },
              { "op": "add", "path": "/a/b/c", "value": [ "foo", "bar" ] },
              { "op": "replace", "path": "/a/b/c", "value": 42 },
              { "op": "move", "from": "/a/b/c", "path": "/a/b/d" },
              { "op": "copy", "from": "/a/b/d", "path": "/a/b/e" }
            ]
        */
                
        int i = 0;
        for (JsonNode k : patch) {
            JsonNode nextOp = k;
            ObjectNode m = null;
            if (k.isArray()) {
                String op = k.get(0).textValue();
                switch (op.charAt(0)) {
                    case '+':
                        m = new ObjectNode(newJson);
                        m.put("op", "add");
                        m.put("path", k.get(1));
                        m.put("value", k.get(2));
                        break;
                    case '-':
                        m = new ObjectNode(newJson);
                        m.put("op", "remove");
                        m.put("path", k.get(1));
                        break;
                    case '*':
                        m = new ObjectNode(newJson);
                        m.put("op", "copy");
                        m.put("from", k.get(1));
                        m.put("path", k.get(2));
                        break;
                    case '/':
                        m = new ObjectNode(newJson);
                        m.put("op", "move");
                        m.put("from", k.get(1));
                        m.put("path", k.get(2));
                        break;
                    case '?':
                        m = new ObjectNode(newJson);
                        m.put("op", "test");
                        m.put("path", k.get(1));
                        m.put("value", k.get(2));
                        break;
                    case '=':
                        m = new ObjectNode(newJson);
                        m.put("op", "replace");
                        m.put("path", k.get(1));
                        m.put("value", k.get(2));
                        break;    
                }
            }
            if (m!=null)
                patch.set(i++, m);
        }
        
        //System.out.println("standard: " + patch.toString());
        
        return JsonPatch.fromJson(patch);
    }

    public static String uuid() {
        return UUID.randomUUID().toString();
    }
    
}
