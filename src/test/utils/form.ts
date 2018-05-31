import {IQuestion} from '../../lib/types/Question';
import {IForm} from '../../lib/types/Form';

export const form = (question: IQuestion): IForm => ({
    'id': 'F1',
    'name': 'Dépôt de dossier',
    'description': 'Information projet',
    'sections': [{
        'id': 'S1',
        'form_id': 'F1',
        'name': 'Sélection de l’appel à candidature et des leviers d’optimisation ',
        'index': 0,
        'questions': [question],
    }]
});

export const s1_qRADIO = {
    'id': 'Q1',
    'section_id': 'S1',
    'label': 'Appel à candidature obligatoire :',
    'question_type': 'RADIO',
    'required': true,
    'index': 0,
    'possibilities': [{
        'id': 'P1',
        'question_id': 'Q1',
        'label': 'Extension des consignes de tri',
        'index': 0,
    }, {
        'id': 'P2',
        'question_id': 'Q1',
        'label': 'Ne pas laisser couler l\'eau',
        'index': 1,
    }],
    'answers': ['Extension des consignes de tri']
};
