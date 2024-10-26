import { FontAwesome } from '@expo/vector-icons';
import React, { useState, useRef, useEffect } from 'react';
import { ScrollView, View, Text, Pressable, StyleSheet } from 'react-native';
import { RichEditor, RichToolbar, actions } from 'react-native-pell-rich-editor';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'; // Importar íconos
import RenderHTML from 'react-native-render-html';
import { TheoryService } from '../services/TheoryService';
import CustomHeader from './CustomHeader';
import { LogBox } from 'react-native';

LogBox.ignoreLogs(['TNodeChildrenRenderer: Support for defaultProps']);

interface TheoryInformationProps {
    text: string | null | undefined
}

const TheoryInformationMobile: React.FC<TheoryInformationProps> = ({ text }) => {
    const [content, setContent] = useState('Acá va el texto'); // Contenido actual
    const [isEditing, setIsEditing] = useState(false); // Controla el estado de edición
    const richText = useRef<RichEditor>(null); // Referencia al editor

    useEffect(() => {
        if (text) {
            setContent(text);
        }
    }, [text])

    const handleSave = () => {
        setIsEditing(!isEditing)
        TheoryService.saveTheory(1, content);
    };

    const handleContentChange = (html: string) => {
        setContent(html)
    };

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <ScrollView contentContainerStyle={styles.container}>
                <CustomHeader title={'Marco Teórico'} logo={require('../../assets/images/logo.jpg')} />
                <View style={styles.content}>
                    {isEditing ? (
                        <View style={{ flex: 1 }}>
                            <RichEditor
                                ref={richText}
                                initialContentHTML={content}
                                onChange={handleContentChange}
                                placeholder="Escribe el marco teórico aquí..."
                                style={styles.richEditor}
                                editorStyle={{
                                    backgroundColor: '#fff',
                                    color: '#000',
                                    contentCSSText: 'font-size: 16px; min-height: 100%;', // Usar 100% de altura
                                }}
                            />
                            <RichToolbar
                                editor={richText}
                                actions={[
                                    actions.setBold,
                                    actions.heading1,
                                    actions.heading2,
                                    actions.setItalic,
                                    actions.setUnderline,
                                    actions.alignLeft,
                                    actions.alignCenter,
                                    actions.alignRight,
                                    actions.insertImage,
                                ]}
                                iconMap={{
                                    [actions.heading1]: () => <FontAwesome name="header" size={20} />,
                                    [actions.heading2]: () => <FontAwesome name="header" size={14} />,
                                    [actions.alignLeft]: () => <FontAwesome name="align-left" size={20} />,
                                    [actions.alignCenter]: () => <FontAwesome name="align-center" size={20} />,
                                    [actions.alignRight]: () => <FontAwesome name="align-right" size={20} />,
                                }}
                                iconTint={"#000"}
                                selectedIconTint={"#2095F2"}
                            />
                        </View>
                    ) : (
                        <ScrollView style={styles.textScroll}>
                            <RenderHTML
                                contentWidth={300} // Ajusta este valor a tu diseño
                                source={{ html: content }}
                            />
                        </ScrollView>
                    )}

                    {isEditing ?
                        <Pressable style={styles.button} onPress={handleSave}>
                            <Icon name={'content-save'} size={20} color="#fff" />
                            <Text style={styles.buttonText}>{'Guardar'}</Text>
                        </Pressable>
                        : <Pressable style={styles.button} onPress={() => setIsEditing(!isEditing)}>
                            <Icon name={'pencil'} size={20} color="#fff" />
                            <Text style={styles.buttonText}>{'Editar'}</Text>
                        </Pressable>
                    }


                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    button: {
        flexDirection: 'row',
        backgroundColor: '#3b5998',
        padding: 10,
        borderRadius: 30,
        marginBottom: 10,
        width: '35%',
        justifyContent: 'center',
        alignSelf: 'flex-end',
        marginTop: 16,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        marginLeft: 8,
    },
    container: { padding: 20 },
    content: {
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 16,
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowRadius: 10,
        elevation: 5,
        minHeight: 750
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
        borderBottomColor: '#3b5998',
        borderBottomWidth: 3,
        paddingBottom: 10
    },
    bodyText: { fontSize: 16 },
    richEditor: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        flex: 1
    },
    textScroll: {
        flex: 1,
    }
});

export default TheoryInformationMobile;
