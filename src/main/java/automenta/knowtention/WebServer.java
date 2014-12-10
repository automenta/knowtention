/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package automenta.knowtention;

import automenta.knowtention.channel.LineFileChannel;
import static io.undertow.Handlers.path;
import static io.undertow.Handlers.resource;
import static io.undertow.Handlers.websocket;
import io.undertow.Undertow;
import io.undertow.server.handlers.resource.FileResourceManager;
import io.undertow.websockets.extensions.PerMessageDeflateHandshake;
import java.io.File;

/**
 *
 * @author me
 */
public class WebServer {
    private final Core core;

    public WebServer(Core c, int port) {
        this(c, "localhost", port);
    }
    
    public WebServer(Core c, String host, int port) {
        this(c, host, port, "./src/web");
    }
    
    public WebServer(Core c, String host, int port, String clientPath) {

        this.core = c;
        
        Undertow server = Undertow.builder()
                .addHttpListener(port, host)
                .setHandler(path()
                    .addPrefixPath("/ws", websocket(new WebSocketConnector(core)).addExtension(new PerMessageDeflateHandshake()))
                        
                .addPrefixPath("/", resource(
                        new FileResourceManager(new File(clientPath), 100)).
                            setDirectoryListingEnabled(true)))
            .build();
        server.start();
        
    }

    /** usage: [port] [host] */
    public static void main(final String[] args) {
        String host = "localhost";
        int port = 8080;
        
        
        if (args.length >= 1) {
            port = Integer.parseInt(args[0]);                        
        }
        if (args.length >= 2) {            
            host = args[1];
        }
        
        System.out.println("Running: " + host + ":" + port);
        
        WebServer w = new WebServer(new Core(), host, port);
        
        
        new Thread(
                new LineFileChannel(w.core.getChannel("chat"), "/home/me/.xchat2/scrollback/FreeNode/#netention.txt") ).start();
    }

}
