/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package automenta.knowtention.model;

import automenta.knowtention.Channel;
import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.core.JsonToken;
import com.fasterxml.jackson.databind.JsonNode;
import java.io.IOException;
import java.io.Serializable;
import java.util.logging.Level;
import java.util.logging.Logger;

/**
 * Calculate measurements of a JSON object
 *  --complexity
 *  --# of strings
 *  --etc
 */
public class JSONObjectMetrics implements Serializable {

    boolean error;
    int numTokens;
    String channel;
    long when;
    private int numStrings, numEmbeddedObjects, numValues, numNulls, numBooleans, numNumbers;
    private long stringLengthSum;
    
    public JSONObjectMetrics(Channel c) {
        this(c.get());  
        
        this.channel = c.id;
    }
    
    public JSONObjectMetrics(JsonNode n) {
        
        this.when = System.currentTimeMillis();
        this.channel = null;
        
        
        JsonParser parser = n.traverse();
        
        error = true;
        while (!parser.isClosed()) {
            
            try {
                
                JsonToken t = parser.nextToken();
                if (t == null)
                    break;
                
                switch (t) {
                    case VALUE_STRING:
                        numValues++;
                        numStrings++;
                        String s = parser.getValueAsString();
                        if (s!=null)
                            stringLengthSum += s.length();
                        break;
                    case VALUE_EMBEDDED_OBJECT:
                        numValues++;
                        numEmbeddedObjects++;
                        break;
                    case VALUE_FALSE:
                    case VALUE_TRUE:
                        numValues++;
                        numBooleans++;
                        break;
                    case VALUE_NUMBER_FLOAT:
                    case VALUE_NUMBER_INT:
                        numNumbers++;
                        numValues++;
                        break;
                    case VALUE_NULL:
                        numValues++;
                        numNulls++;
                        break;
                }
                
                if (t == null)
                    break;
                numTokens++;
                
            } catch (IOException ex) {
                break;
            }
            
        }
        
        error = false;
    }

    public int getNumTokens() {
        return numTokens;
    }

    public boolean isError() {
        return error;
    }

    public String getChannel() {
        return channel;
    }

    public int getNumBooleans() {
        return numBooleans;
    }

    public int getNumEmbeddedObjects() {
        return numEmbeddedObjects;
    }

    public int getNumNulls() {
        return numNulls;
    }

    public int getNumNumbers() {
        return numNumbers;
    }

    public int getNumStrings() {
        return numStrings;
    }

    public int getNumValues() {
        return numValues;
    }

    public long getWhen() {
        return when;
    }

    public long getStringLengthSum() {
        return stringLengthSum;
    }
    
}
