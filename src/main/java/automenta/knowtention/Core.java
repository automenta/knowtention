/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package automenta.knowtention;

import automenta.knowtention.model.JSONObjectMetrics;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;
import java.util.logging.Level;
import java.util.logging.Logger;

/**
 *
 */
public class Core extends EventEmitter {


    final Map<String, Channel> channels = new HashMap();
    
    public Core() {
        super();
    }
    
    /** default, generic anonymous channel */
    public Channel newChannel() {
        Channel c = new Channel( this, newChannelID() );
        channels.put(c.id, c);
        return c;
    }
    
    String newChannelID() {
        return UUID.randomUUID().toString();
    }

    Channel getChannel(WebSocketConnector.WebSocketConnection socket, String id) {
        Channel c = channels.get(id);
        
        //TODO check security permission
        
        if (c == null) {
            c = new Channel( this, id );
            channels.put(id, c);
        }
        
        return c;
    }
    
    final public static ObjectMapper json = new ObjectMapper().disable(SerializationFeature.FAIL_ON_EMPTY_BEANS);
    
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

}
