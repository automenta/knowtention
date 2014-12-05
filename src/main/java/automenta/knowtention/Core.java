/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package automenta.knowtention;

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
    }
    
    /** default, generic anonymous channel */
    public Channel newChannel() {
        Channel c = new Channel( newChannelID() );
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
            c = new Channel( id );
            channels.put(id, c);
        }
        
        return c;
    }
    
}
