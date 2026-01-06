import { StyleSheet as RNStyleSheet } from 'react-native';

const fallbackCreate = (styles: any) => styles;

const StyleSheet = {
  create: (RNStyleSheet && RNStyleSheet.create) || fallbackCreate,
};

export default StyleSheet;
