import '@babel/polyfill';
import Dispatcher from '../utils/dispatcher.js';

/**
 * Criação das instâncias do Axios.
 */

let userId = parent.loginClientDTO ? parent.loginClientDTO.sessionId : 'usuario|bc|0';
let idAplicacao = 'aplicacao|bc|140';
let tipoPesquisa = 'Perfil de pesquisa avançado de dados coletados';
let pathId = 10;

Dispatcher.config({
    baseURL: '/bc/services/'
});

const dispatcher = new Dispatcher();

let getProfileParams = {
    ui: 'cnfg_usua_app_pes',
    filter: {
        AND: [
            {
                AND: [
                    {
                        oper: 'EQUAL',
                        attr: 'cnfg_usua_app_pes.aplicacao_id_aplicacao.id_aplicacao',
                        val: [idAplicacao]
                    },
                    {
                        oper: 'EQUAL',
                        attr: 'cnfg_usua_app_pes.usuario_id_pessoa._id',
                        val: [userId]
                    }
                ]
            }
        ]
    },
    sort: {
        descricao: 'ASC'
    },
    attribs: [
        'id_cnfg_usua_app_pes',
        'descricao',
        'flg_default',
        'id_tipo_pesquisa',
        'aplicacao_id_aplicacao.id_aplicacao',
        'xml_config',
        'data_ultima_alteracao'
    ],
    offset: 0,
    limit: 1000
};

let include = {
    oper: 'EQUAL',
    attr: 'cnfg_usua_app_pes.flg_default',
    val: ['S']
};

export default {
    getLocale() {
        return navigator.language.slice(0, 2);
    },
    async getLabelUIs(uis) {
        const locale = this.getLocale();
        const url = `metadata?loc=${locale}`;
        const allMetaUis = await dispatcher.doGet(url);
        return !uis ? allMetaUis : allMetaUis.filter(metaUi => uis.indexOf(metaUi.name) !== -1);
    },

    async getAttribsFromUI(logicName) {
        const locale = this.getLocale();
        // eslint-disable-next-line
        const url = `/metadata/${logicName}/attributes?fields=label,type&flags=filterable,visible&loc=${locale}`;
        return await dispatcher.doGet(url);
    },

    getOperators(uiName, attribName) {
        return dispatcher.doGet(`metadata/${uiName}/${attribName}/operators?loc=pt`);
    },

    async getSourcesForUI(logicName) {
        return await dispatcher
            .doGet(`metadata/${logicName}/sources?loc=${this.getLocale()}`);
    },

    getAutocompleteFieldoptions() {
        return [{name: 'teste'}, {name: 'abc'}, {name: 'def'}, {name: 'aab'}, {name: 'bbe'}];
        // return dispatcher.doGet(`${uiName}/${attribName}/operators?loc=pt`);
    },

    getTipoSelecaoOptions() {
        return [{id: 1, name: 'Sem campo'}, {id: 2, name: 'TextCombo'}, {id: 3, name: 'TextField'}];
        // return dispatcher.doGet(`${uiName}/${attribName}/operators?loc=pt`);
    },

    async getSearchProfiles() {
        return await dispatcher.doPost('objectQuery', getProfileParams);
    },

    async saveSearchProfiles(obj, param = null) {
        if (param) {
            obj.descricao = param.descricao;
            delete obj.flg_default;
            delete obj.id_cnfg_usua_app_pes;
            obj['_diretorios'] = {
                add: [pathId]
            };
            if (tipoPesquisa) obj.id_tipo_pesquisa = 'Perfil de pesquisa avançado de dados coletados';
        }
        obj.usuario_id_pessoa = {
            id_usuario: userId
        };
        let json = {
            cnfg_usua_app_pes: [
                obj
            ]
        };
        return await dispatcher.doPost('persistence', json);
    },

    async renameSearchProfiles(param, name) {
        let obj = {
            cnfg_usua_app_pes: [
                {
                    id_cnfg_usua_app_pes: param.id_cnfg_usua_app_pes,
                    descricao: name,
                    data_ultima_alteracao: param.data_ultima_alteracao,
                    _diretorios: {
                        add: [pathId]
                    }
                }
            ]
        };
        return await dispatcher.doPut('persistence', obj);
    },

    async editProfile(obj) {
        let json = {
            cnfg_usua_app_pes: [
                {
                    id_cnfg_usua_app_pes: obj.id_cnfg_usua_app_pes,
                    descricao: obj.descricao,
                    data_ultima_alteracao: obj.data_ultima_alteracao,
                    xml_config: obj.xml_config,
                    _diretorios: {
                        add: [pathId]
                    }
                }
            ]
        };
        return await dispatcher.doPut('persistence', json);
    },

    async deleteSearchProfiles(param) {
        await dispatcher.doDelete(`delete/cnfg_usua_app_pes/${param.id_cnfg_usua_app_pes}`);
    },

    async setDefaultProfile(param) {
        await this.getDefaultsAndSetAsNotDefault();
        let obj = {
            cnfg_usua_app_pes: [
                {
                    id_cnfg_usua_app_pes: param.id_cnfg_usua_app_pes,
                    descricao: param.descricao,
                    data_ultima_alteracao: param.data_ultima_alteracao,
                    flg_default: 'S',
                    _diretorios: {
                        add: [pathId]
                    }
                }
            ]
        };
        await dispatcher.doPut('persistence', obj);
    },

    async getDefaultsAndSetAsNotDefault() {
        let count = 0;
        let params = JSON.parse(JSON.stringify(getProfileParams));
        params.filter.AND[0].AND.push(include);
        let response = await dispatcher.doPost('objectQuery', params);
        let obj = {
            cnfg_usua_app_pes: [
            ]
        };
        if (response.uis.length) {
            response.uis.forEach(ui => {
                if (ui.flg_default.valor === 'Sim') {
                    obj = this.resetDefaultValue(obj, ui);
                    count += 1;
                }
            });
        }
        if (count) {
            await dispatcher.doPut('persistence', obj);
        }
        return;
    },

    resetDefaultValue(obj, ui) {
        obj.cnfg_usua_app_pes.push(
            {
                id_cnfg_usua_app_pes: ui.id_cnfg_usua_app_pes,
                descricao: ui.descricao,
                data_ultima_alteracao: ui.data_ultima_alteracao,
                flg_default: 'N',
                _diretorios: {
                    add: [pathId]
                }
            }
        );
        return obj;
    }

};
