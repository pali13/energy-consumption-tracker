import React, { useEffect, useState } from 'react';
import { Platform } from 'react-native';
import TheoryInformationWeb from './TheoryInformationWeb';
import TheoryInformationMobile from './TheoryInformationMobile';
import { getTheory } from '../helpers/helpers';

const TheoryInformation: React.FC = () => {
    const [text, setText] = useState<string | null>()

    const chargeTheory = async () => {
        try {
            const theory = await getTheory(1);
            if (theory) {
                setText(theory.text);
            }
        } catch (error) {
            console.error("Error al obtener la teoría");
        }

    };

    useEffect(() => {
        chargeTheory();
    }, []);

    return Platform.select({
        web: <TheoryInformationWeb text={text} />,
        default: <TheoryInformationMobile text={text} />
    });
};

export default TheoryInformation;
