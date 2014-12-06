/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package automenta.knowtention.example;

import automenta.knowtention.Channel;
import automenta.knowtention.Channel.ChannelChange;
import automenta.knowtention.Core;
import automenta.knowtention.WebServer;
import automenta.knowtention.model.JSONObjectMetrics;
import com.github.fge.jsonpatch.JsonPatch;

/**
 *
 * @author me
 */
public class ReportJSONComplexity {
 
    public static void main(final String[] args) {
        Core c = new Core();
        c.on(Channel.ChannelChange.class, new ChannelChange() {
            @Override public void event(Channel c, JsonPatch p) {
                
                JSONObjectMetrics complexity = new JSONObjectMetrics(c);
                System.out.println( Core.toJSON(complexity) );
                
            }
        });
        new WebServer(c, 8080);
    }
    
}
