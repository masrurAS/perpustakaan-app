import React from "react";
import { Text } from "native-base";
import {
  ActivityIndicator, ActivityIndicatorProps,
  StyleProp, StyleSheet, TextStyle, View, ViewStyle,
  useWindowDimensions,
  ColorValue
} from "react-native";

const colors = {
  primary: '#5373A6',
  primary2: '#6587BC',
  secondary: '#6587BC',
  accent: '#FD6F61',
  light_grey: '#F4F8FC',
  light_grey2: '#FAFAFC',
  white: '#FFF',
  lighter: '#F3F3F3',
  light: '#DAE1E7',
  dark: '#444',
  darker: '#222',
  black: '#000',
  text_dark: '#1E3354',
  text_light: 'rgba(0, 0, 0, .38)',
  backdrop: 'rgba(0, 0, 0, .4)',
  status_online: '#2CDD00',
  transparent: 'transparent',
  blue: '#1001f7'
}

export interface LoaderProps extends ActivityIndicatorProps {
  containerStyle?: StyleProp<ViewStyle>,
  textStyle?: StyleProp<TextStyle>,
  full?: boolean,
  label?: string,
  inline?: boolean,
  color?: ColorValue
}

const Loader: React.FC<LoaderProps> = (props) => {
  const window = useWindowDimensions();
  const defaultColor = props.full ? colors.light_grey : colors.primary;
  const defaultTextColor = props.full ? colors.dark : colors.text_light;
  let textSize = 20;
  if (props.size == 'large') textSize = 22;
  if (props.size == 'small') textSize = 17;
  return (
    <View style={[styles.container, props.full ? [styles.container_full, { width: window.width, height: window.height }] : {}, props.inline ? styles.container_inline : {}, props.containerStyle ?? {}]}>
      <ActivityIndicator {...props} color={props.color ?? defaultColor} style={[styles.loader, props.full ? {marginVertical: 10} : {}]} />
      { props.label ? <Text style={[styles.text, { color: defaultTextColor, fontSize: textSize }, props.textStyle ?? {}]}>{props.label}</Text> : null }
      { props.children }
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  container_inline: {
    flexDirection: 'row',
  },
  container_full: {
    position: 'absolute',
    zIndex: 100,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  loader: {
    
  },
  text: {
    textShadowColor: 'rgba(255,255,255,0.5)',
    textShadowRadius: 10,
    marginHorizontal: 5,
    backgroundColor: colors.transparent
  }
});

export default Loader;