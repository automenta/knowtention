//package automenta.knowtention;
//
//import java.io.File;
//import java.io.IOException;
//import java.net.InetSocketAddress;
//import java.net.UnknownHostException;
//import java.util.HashMap;
//import java.util.Map;
//import org.java_websocket.WebSocket;
//import org.java_websocket.WebSocketImpl;
//import org.java_websocket.handshake.ClientHandshake;
//import org.java_websocket.server.WebSocketServer;
//
//public class WebServer  {
//
//    private static final int DEFAULT_WEBSOCKET_PORT = 10000;
//    static final boolean WEBSOCKET_DEBUG = false;
//    
//    private static int cycleIntervalMS = 50;
//    
//    class NARSWebSocketServer extends WebSocketServer  {
//
//        public NARSWebSocketServer(InetSocketAddress addr) throws UnknownHostException {
//            super(addr);
//        }
//     
//        @Override
//        public void onOpen(final WebSocket conn, ClientHandshake handshake) {
//            //this.sendToAll("new connection: " + handshake.getResourceDescriptor());
//
//            WebSocketImpl.DEBUG /*= WebSocket.DEBUG */ = WEBSOCKET_DEBUG;
//
//            if (WEBSOCKET_DEBUG) System.out.println("Connect: " + conn.getRemoteSocketAddress().getAddress().getHostAddress());
//
//            final Connection n = new Connection(); {
//                /*@Override public void println(String output) {
//                    conn.send(output);
//                }*/
//            };
//            socketSession.put(conn, n);
//
//        }
//
//        @Override
//        public void onClose(WebSocket conn, int code, String reason, boolean remote) {
//            if (WEBSOCKET_DEBUG) System.out.println(conn + " disconnected");
//
//            Connection n = socketSession.get(conn);
//            if (n!=null) {
//                n.stop();
//                socketSession.remove(conn);
//            }
//        }
//
//        @Override
//        public void onMessage(WebSocket conn, String message) {
//
//            Connection n = socketSession.get(conn);
//            if (n!=null) {
//                n.read(message);
//            }
//        }
//
//
//        @Override
//        public void onError(WebSocket conn, Exception ex) {
//            ex.printStackTrace();
//            if (conn != null) {
//                // some errors like port binding failed may not be assignable to a specific websocket
//            }
//        }
//        
//    }
//    
//    final NARSWebSocketServer websockets;
//    private final Map<WebSocket, Connection> socketSession = new HashMap();
//
//    public WebServer(int httpPort, int webSocketsPort) throws UnknownHostException, IOException {
//        websockets = new NARSWebSocketServer(new InetSocketAddress(webSocketsPort));
//        websockets.start();
//        
//        new HTTPServeFiles(httpPort, new File("web/"));
//        
//    }
//
//
//
//    public static void main(String[] args) throws Exception {
//                
//        int httpPort;
//        int wsPort = DEFAULT_WEBSOCKET_PORT;
//        
//        String nlpHost = null;
//        int nlpPort = 0;
//        
//        if (args.length < 1) {
//            System.out.println("Usage: WebServer <httpPort> [nlpHost nlpPort] [cycleIntervalMS]");
//            
//            return;
//        }
//        else {
//            httpPort = Integer.parseInt(args[0]);
//            
//            if (args.length >= 3) {
//                nlpHost = args[1];
//                if (!"null".equals(args[2])) {
//                    nlpPort = Integer.parseInt(args[2]);
//                    //nlp = new NLPInputParser(nlpHost, nlpPort);
//                }
//            }
//            if (args.length >= 4) {
//                cycleIntervalMS = Integer.parseInt(args[3]);
//            }
//        }
//                
//        WebServer s = new WebServer(httpPort, wsPort);
//        
//        System.out.println("Knowtention ready. port: " + httpPort + ", websockets port: " + wsPort);
//        System.out.println("  Cycle interval (ms): " + cycleIntervalMS);
//
//
//    }
//
//
//    
//    /**
//     * Sends <var>text</var> to all currently connected WebSocket clients.
//     *
//     * @param text The String to send across the network.
//     * @throws InterruptedException When socket related I/O errors occur.
//     */
//    /*public void sendToAll(String text) {
//        Collection<WebSocket> con = connections();
//        synchronized (con) {
//            for (WebSocket c : con) {
//                c.send(text);
//            }
//        }
//    }*/
//
//
//
//}
