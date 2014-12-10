/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package automenta.knowtention.channel;

import automenta.knowtention.Channel;
import automenta.knowtention.Channel.ChannelChange;
import automenta.knowtention.Core;
import automenta.knowtention.Runner;
import com.fasterxml.jackson.databind.node.ObjectNode;
import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.IOException;
import java.nio.ByteBuffer;
import java.nio.channels.FileChannel;
import java.util.LinkedList;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;

/**
 * Watches a file for changes ("tail -f"), creating new nodes for each line with
 * appropriate metadata
 */
public class LineFileChannel extends Runner {

    long delayPeriodMS = 1000;
    private final File file;
    private boolean running = true;
    int numLines = 3;
    Channel channel;

    public LineFileChannel(Channel c, String filename) {        
        this.channel = c;
        this.file = new File(filename);
    }

    public void stop() {
        running = false;
    }

    @Override
    public void run() {

        FileInputStream fileInputStream = null;
        FileChannel channel = null;
        ByteBuffer buffer = null;
        LinkedList<String> lines = new LinkedList();
        StringBuilder builder = new StringBuilder();
        long lastSize = -1, lastLastModified = -1;
        
        while (running) {
            try {
                Thread.sleep(delayPeriodMS);
            } catch (InterruptedException ex) {
            }

            lines.clear();
            try {
                fileInputStream = new FileInputStream(file);
                
                channel = fileInputStream.getChannel();

                long lastModified = file.lastModified();
                long csize = channel.size();
                if ((lastModified==lastLastModified) && (csize == lastSize)) //also check file update time?
                    continue;
                
                int currentPos = (int) csize;
                                
                buffer = channel.map(FileChannel.MapMode.READ_ONLY, 0, csize);
                buffer.position(currentPos);
                lastSize = csize;
                lastLastModified = lastModified;
                
                int count = 0;

                for (long i = csize - 1; i >= 0; i--) {

                    char c = (char) buffer.get((int) i);
                    
                    if (c == '\n') {
                        count++;
                        builder.reverse();
                        lines.addFirst(builder.toString());
                        if (count == numLines) {
                            break;
                        }
                        builder.setLength(0);
                    }
                    else
                        builder.append(c);
                }                
                
                update(lines);
                
                lines.clear();
                buffer.clear();
                channel.close();
                fileInputStream.close();
                fileInputStream = null;
                
            } catch (Exception ex) {
                Logger.getLogger(LineFileChannel.class.getName()).log(Level.SEVERE, null, ex);
            }
        }
        try {
            channel.close();
        } catch (IOException ex) {
            Logger.getLogger(LineFileChannel.class.getName()).log(Level.SEVERE, null, ex);
        }
    }

/*    public void run2() {

        BufferedReader input = null;

        while (running) {

            try {
                Thread.sleep(delayPeriodMS);
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
                break;
            }
            if (input == null) {
                try {
                    input = new BufferedReader(new FileReader(file));
                } catch (FileNotFoundException ex) {
                    input = null;
                    continue;
                }

            }
            String currentLine = null;

            try {
                if ((currentLine = input.readLine()) != null) {
                    if (currentLine != null) {
                        onNewLine(currentLine);
                    }
                }
            } catch (IOException ex) {

            }

        }

        try {
            input.close();
        } catch (IOException ex) {
            ex.printStackTrace();
        }
    }*/

    protected void onNewLine(String currentLine) {
//        long now = System.currentTimeMillis();
//        String id = "n" + now;
//        addNode(Core.fromJSON("{ id:'" + id + "', content: '" + currentLine + "' }"));
//        System.out.println(getSnapshot());
    }

    public Thread start() {
        Thread t = new Thread(this);
        t.start();
        return t;
    }

    private synchronized void update(List<String> lines) {
        //long now = System.currentTimeMillis();
        
        channel.tx(new Runnable() {
            @Override public void run() {
                for (int i = 0; i < lines.size(); i++) {
                    String currentLine = lines.get(i);


                    channel.addVertex(
                            Core.newJson.objectNode().
                                    put("id", channel.id + "_" + (currentLine.hashCode())).
                                    put("content", currentLine)
                    );
                }
            }            
        });

    }

}
