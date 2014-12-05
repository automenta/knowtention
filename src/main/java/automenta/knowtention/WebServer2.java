/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package automenta.knowtention;

import static io.undertow.Handlers.path;
import static io.undertow.Handlers.resource;
import static io.undertow.Handlers.websocket;
import io.undertow.Undertow;
import io.undertow.server.handlers.resource.FileResourceManager;
import io.undertow.websockets.WebSocketConnectionCallback;
import io.undertow.websockets.core.AbstractReceiveListener;
import io.undertow.websockets.core.BufferedTextMessage;
import io.undertow.websockets.core.WebSocketChannel;
import io.undertow.websockets.extensions.PerMessageDeflateHandshake;
import io.undertow.websockets.spi.WebSocketHttpExchange;
import java.io.File;

/**
 *
 * @author me
 */
public class WebServer2 {

    public static void main(final String[] args) {

        boolean filesCached = false;

        Undertow server = Undertow.builder()
                .addHttpListener(8080, "localhost")
                .setHandler(path()
                        .addPrefixPath("/ws", websocket(new WebSocketConnectionCallback() {

                            @Override
                            public void onConnect(WebSocketHttpExchange exchange, WebSocketChannel channel) {
                                channel.getReceiveSetter().set(new AbstractReceiveListener() {

                                    @Override
                                    protected void onFullTextMessage(WebSocketChannel channel, BufferedTextMessage message) {
                                        //WebSockets.sendText(message.getData(), channel, null);
                                    }
                                });
                                channel.resumeReceives();
                            }
                        }).addExtension(new PerMessageDeflateHandshake()))
                
                        .addPrefixPath("/", resource(new FileResourceManager(new File("./src/web"), 100)).setDirectoryListingEnabled(true)))
                .build();
        server.start();
    }

}
