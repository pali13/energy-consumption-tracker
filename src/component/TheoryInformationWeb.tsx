import React, { useEffect, useState } from 'react';
import { ScrollView, View, Text, Pressable, StyleSheet, Platform } from 'react-native';
import RenderHTML from 'react-native-render-html';
import CustomHeader from './CustomHeader';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { TheoryService } from '../services/TheoryService';
import 'react-quill/dist/quill.snow.css';

interface TheoryInformationProps {
    text: string | null | undefined
}

const TheoryInformationWeb: React.FC<TheoryInformationProps> = ({ text }) => {
    // Importa Quill solo para web
    let ReactQuill: any;
    if (Platform.OS == 'web') {
        ReactQuill = require('react-quill'); // Importa ReactQuill solo en web
    } else {
        return null; // O devuelve un componente vacío o algún mensaje
    }

    const [content, setContent] = useState('Aquí iría el texto inicial'); // Contenido actual
    const [isEditing, setIsEditing] = useState(false); // Controla el estado de edición

    useEffect(() => {
        if (text) {
            setContent(text);
        }
    }, [text])

    const handleSave = (html: string) => {
        setIsEditing(false);
        setContent(html);
        TheoryService.saveTheory(1, html);
    };

    const handleContentChange = (html: string) => {
        setContent(html)
    };

    return (
        <ScrollView style={styles.container}>
            <CustomHeader title={'Marco Teórico'} logo={require('../../assets/images/logo.jpg')} />
            <View style={styles.content}>
                {isEditing ? (
                    <>
                        {/* {ReactQuill && ( */}
                            <ReactQuill
                                value={content}
                                onChange={handleContentChange}
                                theme="snow" // Tema básico de Quill
                                placeholder="Escribe el marco teórico aquí..."
                            />
                        {/* )} */}
                        <Pressable style={styles.button} onPress={() => handleSave(content)}>
                            <Icon name={'content-save'} size={20} color="#fff" />
                            <Text style={styles.buttonText}> {"Guardar"}</Text>
                        </Pressable>
                    </>
                ) : (
                    <View>
                        <RenderHTML
                            contentWidth={300} // Ajusta este valor a tu diseño
                            source={{ html: content }}
                        />
                        <Pressable style={styles.button} onPress={() => setIsEditing(!isEditing)}>
                            <Icon name={'pencil'} size={20} color="#fff" />
                            <Text style={styles.buttonText}> {"Editar"}</Text>
                        </Pressable>
                    </View>
                )}
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 50
    },
    content: {
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 16,
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowRadius: 10,
        elevation: 5
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10
    },
    bodyText: {
        fontSize: 16
    },
    textarea: {
        width: '100%',
        minHeight: 200,
        borderColor: '#ccc',
        borderWidth: 1,
        padding: 10
    },
    button: {
        flexDirection: 'row',
        backgroundColor: '#3b5998',
        padding: 10,
        borderRadius: 30,
        marginBottom: 10,
        width: '20%',
        justifyContent: 'center',
        alignSelf: 'flex-end',
        marginTop: 50,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        marginLeft: 8,
    },
});

export default TheoryInformationWeb;
