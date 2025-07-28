package com.eustache.virunga.utils;

import java.util.function.Consumer;

public class UpdateUtil {
    public static <T> void setNotNull(T value, Consumer<T> setter) {
        if (value != null) {
            setter.accept(value);
        }
    }
}
