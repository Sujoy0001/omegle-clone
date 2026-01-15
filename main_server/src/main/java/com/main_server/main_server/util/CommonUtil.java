package com.main_server.main_server.util;

import java.util.UUID;

public class CommonUtil {
    public static String generateUniqueId() {
        return UUID.randomUUID().toString();
    }
}
