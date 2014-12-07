/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package automenta.knowtention;

import automenta.knowtention.Channel.ChannelChange;
import automenta.knowtention.EventEmitter.EventObserver;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.github.fge.jsonpatch.JsonPatch;
import io.undertow.websockets.WebSocketConnectionCallback;
import io.undertow.websockets.core.AbstractReceiveListener;
import io.undertow.websockets.core.BufferedBinaryMessage;
import io.undertow.websockets.core.BufferedTextMessage;
import io.undertow.websockets.core.StreamSourceFrameChannel;
import io.undertow.websockets.core.WebSocketCallback;
import io.undertow.websockets.core.WebSocketChannel;
import io.undertow.websockets.core.WebSockets;
import io.undertow.websockets.spi.WebSocketHttpExchange;
import java.io.IOException;
import java.nio.ByteBuffer;
import java.util.HashMap;
import java.util.Map;

/**
 * Manages websocket i/o to a channel
 */
public class WebSocketConnector implements WebSocketConnectionCallback {

    private Core core;

    public WebSocketConnector(Core c) {
        super();
        this.core = c;
    }

    public class WebSocketConnection extends AbstractReceiveListener implements WebSocketCallback<Void> {

        final Map<String, Channel> channels = new HashMap();

        public WebSocketConnection(WebSocketChannel socket) {
            super();

            System.out.println(socket.getPeerAddress() + " connected websocket");

            Channel c = core.newChannel();
            addChannel(c);

            send(socket, c);
        }

        public void addChannel(Channel c) {
            channels.put(c.id, c);
        }

        public Channel getChannel(String id) {
            Channel c = channels.get(id);
            if (c == null) {
                c = core.getChannel(this, id);
                return c;
            }
            return null;
        }

        @Override
        protected void onFullTextMessage(WebSocketChannel socket, BufferedTextMessage message) throws IOException {

            try {
                //System.out.println(socket + " recv txt: " + message.getData());
                JsonNode j = Core.json.readValue(message.getData(), JsonNode.class);
                if (j.isArray()) {
                    if (j.size() > 1) {

                        String operation = j.get(0).textValue();

                        switch (operation) {
                            case "p":  onPatch(j, socket); break;
                            case "on": onOn(j, socket); break;
                            case "off": onOff(j, socket); break;
                        }
                    }

                }
            } catch (Exception e) {
                e.printStackTrace();
            }
        }

        public final EventObserver channelObserver = new EventObserver() {

            @Override
            public void event(Class event, Object[] args) {
            }
            
        };

        protected Channel setChannelSubscription(JsonNode j, WebSocketChannel socket, boolean subscribed) {
            String channel = j.get(1).textValue();
            
            Channel c = core.getChannel(this, channel);
            if (c==null) {
                send(socket, channel + " does not exist");
                return null;
            }
            
            c.set(channelObserver, subscribed, ChannelChange.class);            
            
            return c;
        }
        
        /** 'on', subscribe */
        protected void onOn(JsonNode j, WebSocketChannel socket) {
            Channel c = setChannelSubscription(j, socket, true);
            if (c==null) return;
            
            //send initial state
            send(socket, c.getSnapshot());
        }
        
        /** 'off', unsubscribe */
        protected void onOff(JsonNode j, WebSocketChannel socket) {
            setChannelSubscription(j, socket, false);            
        }

        protected void onPatch(JsonNode j, WebSocketChannel socket) {
            //jsonpatch
            String channel = j.get(1).textValue();
            
            Channel c = getChannel(channel);
            
            ArrayNode patchJson = (ArrayNode) j.get(2);
            try {
                
                
                JsonPatch patch = Core.getPatch(patchJson);
                c.applyPatch(patch);
                
            } catch (Exception e) {
                e.printStackTrace();
                clientError(socket, e.toString());
            }
        }

        public void clientError(WebSocketChannel socket, String message) {
            WebSockets.sendText(message, socket, null);
        }

        @Override
        protected void onFullBinaryMessage(WebSocketChannel channel, BufferedBinaryMessage message) throws IOException {

            //System.out.println(channel + " recv bin: " + message.getData());
        }

        @Override
        protected void onClose(WebSocketChannel socket, StreamSourceFrameChannel channel) throws IOException {

            System.out.println(socket.getPeerAddress() + " disconnected websocket");
        }

        /**
         * send the complete copy of the channel
         */
        public void send(WebSocketChannel socket, Channel c) {
            send(socket, c.node);
        }

        public void send(WebSocketChannel socket, Object object) {
            try {
                ByteBuffer data = ByteBuffer.wrap(Core.json.writeValueAsBytes(object));
                //System.out.println("Sending: " + data);
                WebSockets.sendText(data, socket, this);
            } catch (JsonProcessingException ex) {
                ex.printStackTrace();
            }
        }

        @Override
        public void complete(WebSocketChannel wsc, Void t) {
            //System.out.println("Sent: " + wsc);
        }

        @Override
        public void onError(WebSocketChannel wsc, Void t, Throwable thrwbl) {
            //System.out.println("Error: " + thrwbl);
        }

    }

    @Override
    public void onConnect(WebSocketHttpExchange exchange, WebSocketChannel socket) {
        socket.getReceiveSetter().set(new WebSocketConnection(socket));
        socket.resumeReceives();

    }

}
