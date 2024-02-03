/**
 *
 * Gestion des requêtes de l'app
 *
 * @version 1.0
 * @since 1.0: version initiale
 */

// ######################################################################
//                              IMPORT
// ######################################################################
import axios from 'axios';
import {
    apiUrl,
    APP_TITLE,
    TEMPLATES_INIT,
    TEMPLATES_SUCCESS,
    TEMPLATES_FAILURE,
    EDITOR_SHOW_HELPERS,
    EDITOR_HIDE_HELPERS
} from '../constants/index'



// ######################################################################
//                              EDITOR
// ######################################################################
export const show_helpers = () => ({ type: EDITOR_SHOW_HELPERS });
export const hide_helpers = () => ({ type: EDITOR_HIDE_HELPERS });


// ######################################################################
//                              MODELES
// ######################################################################
const update_title = (component) => ({ type: APP_TITLE, payload: component });
const templates_init = () => ({ type: TEMPLATES_INIT });
const templates_success = (data) => ({ type: TEMPLATES_SUCCESS, payload: data });
const templates_failed = (error) => ({ type: TEMPLATES_FAILURE, payload: error });



// récupération des modèles de cartons
const get_templates = () => {
    return (dispatch, getState) => {
        let sessionId = localStorage.getItem('x-token');
        let config = { params: {  }, headers: { 'Authorization': "Bearer " + sessionId } };

        dispatch(templates_init());
        return axios.get(`${apiUrl}/api/1.0/templates`, config)
            .then(function (response) {
                dispatch(templates_success(response.data));
            })
            .catch(function (error) {
                if (!error.response)
                    dispatch(templates_failed({ header: "Erreur!", message: error.message }));
                else
                    dispatch(templates_failed({ header: "La récupération des modèles a échoué!", message: error.response.statusText }));
            })
    }
}


// récupération d'un modèle de carton
const get_template_svg = (name, length, width, height) => {
    return (dispatch, getState) => {

        let sessionId = localStorage.getItem('x-token');
        let config = { params: { name, length, width, height }, headers: { 'Authorization': "Bearer " + sessionId } };

        const p = new Promise((resolve, reject) => {
            axios.get(`${apiUrl}/api/1.0/template/svg`, config)
                .then(response => {
                    resolve(response.data);
                })
                .catch(error => {
                    reject({ header: "Erreur!", message: error.message });
                })
        });
        return p;
    };
};



// ######################################################################
//                              PROJECTS
// ######################################################################

// /api/1.0/workspaces

// récupération d'un modèle de carton
const get_projects = () => {
    return (dispatch, getState) => {

        let sessionId = localStorage.getItem('x-token');
        let config = { params: {  }, headers: { 'Authorization': "Bearer " + sessionId } };

        const p = new Promise((resolve, reject) => {
            axios.get(`${apiUrl}/api/1.0/workspaces`, config)
                .then(response => {
                    resolve(response.data);
                })
                .catch(error => {
                    reject({ header: "Erreur!", message: error.message });
                })
        });
        return p;
    };
};


const get_workspace = (paramsQuery) => {
    return (dispatch, getState) => {
        const {workspace_id, customer_email} = paramsQuery
        let sessionId = localStorage.getItem('x-token')
        let config = { params: { workspace_id, customer_email }, headers: { 'Authorization': "Bearer " + sessionId } }
        const p = new Promise((resolve, reject) => {
            axios.get(`${apiUrl}/api/1.0/workspace`, config)
                .then(response => {
                    resolve(response.data);
                })
                .catch(error => {
                    reject({ header: "Erreur!", message: error.message });
                })
        });
        return p;
    };
};


const delete_workspace = (workspace_id) => {
    return (dispatch, getState) => {

        let sessionId = localStorage.getItem('x-token');
        let config = { params: { workspace_id }, headers: { 'Authorization': "Bearer " + sessionId } };

        const p = new Promise((resolve, reject) => {
            axios.delete(`${apiUrl}/api/1.0/workspace`, config)
                .then(response => {
                    resolve(response.data);
                })
                .catch(error => {
                    reject({ header: "Erreur!", message: error.message });
                })
        });
        return p;
    };
};

//
const post_workspace = (template_name, label, name_project, type_defined, date, base, config = {
    version:1,
    thickness:4,
    thickness_resource_id:0,
    colors:{},
    front:[],
    back:[]
  }) => {
    return (dispatch, getState) => {

        let sessionId = localStorage.getItem('x-token');
        let _config = { params: {}, headers: { 'Authorization': "Bearer " + sessionId } };
        const p = new Promise((resolve, reject) => {
            axios.post(`${apiUrl}/api/1.0/workspace`, {template_name, label, name_project, type_defined, date, base, config}, _config)
                .then(response => {
                    resolve(response.data);
                })
                .catch(error => {
                    reject({ header: "Erreur!", message: error.message });
                })
        });
        return p;
    };
};

const create_workspace_from_available = (label, base, config = {
    version:1,
    thickness:4,
    thickness_resource_id:0,
    colors:{},
    front:[],
    back:[]}, type_defined, name_project, owner_id, template_id, date, template_parent_id, customer_email, workspace_price, imageBase64, workspace_svg, form_key, product_id) => {
    return (dispatch, getState) => {
        let sessionId = localStorage.getItem('x-token');
        let _config = { params: {} , headers: { 'Authorization': "Bearer " + sessionId } };

        const p = new Promise((resolve, reject) => {
            axios.post(`${apiUrl}/api/1.0/workspace_available`, { label, base, type_defined, name_project, owner_id, template_id, date, template_parent_id, customer_email, workspace_price, imageBase64, workspace_svg, form_key, product_id, config}, _config)
                .then(response => {
                    resolve(response.data);
                })
                .catch(error => {
                    reject({ header: "Erreur!", message: error.message });
                })
        });
        return p;
    };
};

const login_user = ( username, password, loginUrl, formKey) => {
    return (dispatch, getState) => {
        let _config = { params: {} , 
                        headers: {  'X-Requested-With': 'XMLHttpRequest', 
                                    'Content-Type': 'application/json',
                                    "Access-Control-Allow-Origin" : "*" }};
        const p = new Promise((resolve, reject) => {
            axios.post(loginUrl, JSON.stringify({   username: username,
                                                    password: password,
                                                    form_key: formKey
                                                    }), _config)
                .then(response => {
                    resolve(response.data);
                })
                .catch(error => {
                    reject({ header: "Erreur!", message: error.message });
                })
        });
        return p;
    };
};

const create_user_box = ( firstName, lastName, email, password, passwordConfirm, formKey, registerUrl) => {
    return (dispatch, getState) => {
        let _config = { params: {} , 
                        headers: {  'X-Requested-With': 'XMLHttpRequest', 
                                    'Content-Type': 'application/json',
                                    "Access-Control-Allow-Origin" : "*" }};
        const p = new Promise((resolve, reject) => {
            axios.post(registerUrl, JSON.stringify({firstname: firstName,
                                                    lastname: lastName,
                                                    email: email,
                                                    password: password,
                                                    password_confirmation: passwordConfirm,
                                                    form_key: formKey }), _config)
                    .then(response => {
                        resolve(response.data);
                    })
                    .catch(error => {
                        reject({ header: "Erreur!", message: error.message });
                    }) 
        });
        return p;
    };
};



const workspace_upload_workspace_from_available = (imageBase64, nameFile) => {
    return (dispatch, getState) => {
        let sessionId = localStorage.getItem('x-token');
        let _config = { params: {} , headers: { 'Authorization': "Bearer " + sessionId } };

        const p = new Promise((resolve, reject) => {
            axios.post(`${apiUrl}/api/1.0/workspace_upload`, { imageBase64, nameFile }, _config)
                .then(response => {
                    resolve(response.data);
                })
                .catch(error => {
                    reject({ header: "Erreur!", message: error.message });
                })
        });
        return p;
    };
};

//
const put_workspace = (workspace_id, label, config, base, name_project, owner_id) => {
    return (dispatch, getState) => {

        let sessionId = localStorage.getItem('x-token');
        let _config = { params: { workspace_id, label, owner_id }, headers: { 'Authorization': "Bearer " + sessionId} };

        const p = new Promise((resolve, reject) => {
            axios.put(`${apiUrl}/api/1.0/workspace`, {config, base, name_project}, _config)
                .then(response => {
                    resolve(response.data);
                })
                .catch(error => {
                    reject({ header: "Erreur!", message: error.message });
                })
        });
        return p;
    };
};

// ######################################################################
//                              USER
// ######################################################################

// /user

// récupération d'un ou plusieurs users
const get_user = (login) => {
    return (dispatch, getState) => {

        let sessionId = localStorage.getItem('x-token');
        let config = { params: { login }, headers: { 'Authorization': "Bearer " + sessionId } };

        const p = new Promise((resolve, reject) => {
            axios.get(`${apiUrl}/user`, config)
                .then(response => {
                    resolve(response.data);
                })
                .catch(error => {
                    reject({ header: "Erreur!", message: error.message });
                })
        });
        return p;
    };
};

// creation / mise à jour d'un user
const post_user = (login, role, email, company, password, disable) => {
    return (dispatch, getState) => {
        let id = login;
        let sessionId = localStorage.getItem('x-token');
        let config = { params: { login, role, email, id, company, password, disable }, headers: { 'Authorization': "Bearer " + sessionId } };

        const p = new Promise((resolve, reject) => {
            axios.post(`${apiUrl}/user`, null, config)
                .then(response => {
                    resolve(response.data);
                })
                .catch(error => {
                    reject({ header: "Erreur!", message: error.message });
                })
        });
        return p;
    };
};

// suppression d'un user 
const delete_user = (login) => {
    return (dispatch, getState) => {

        let sessionId = localStorage.getItem('x-token');
        let config = { params: { login }, headers: { 'Authorization': "Bearer " + sessionId } };

        const p = new Promise((resolve, reject) => {
            axios.delete(`${apiUrl}/user`, config)
                .then(response => {
                    resolve(response.data);
                })
                .catch(error => {
                    reject({ header: "Erreur!", message: error.message });
                })
        });
        return p;
    };
};


// ######################################################################
//                              RESSOURCE
// ######################################################################

// /api/1.0/resource

// récupération d'une ressource
const get_ressource = (resource_id) => {
    return (dispatch, getState) => {

        let sessionId = localStorage.getItem('x-token');
        let config = { params: { resource_id }, headers: { 'Authorization': "Bearer " + sessionId } };

        const p = new Promise((resolve, reject) => {
            axios.get(`${apiUrl}/api/1.0/resource`, config)
                .then(response => {
                    resolve(response.data);
                })
                .catch(error => {
                    reject({ header: "Erreur!", message: error.message });
                })
        });
        return p;
    };
};

// suppression une ressource 
const delete_ressource = (resource_id) => {
    return (dispatch, getState) => {

        let sessionId = localStorage.getItem('x-token');
        let config = { params: { resource_id }, headers: { 'Authorization': "Bearer " + sessionId } };

        const p = new Promise((resolve, reject) => {
            axios.delete(`${apiUrl}/api/1.0/resource`, config)
                .then(response => {
                    resolve(response.data);
                })
                .catch(error => {
                    reject({ header: "Erreur!", message: error.message });
                })
        });
        return p;
    };
};

// creation / mise à jour d'une ressource
const post_ressource = (type, data, resource_id) => {
    return (dispatch, getState) => {

        let sessionId = localStorage.getItem('x-token');
        let config = { params: { type, resource_id }, headers: { 'Authorization': "Bearer " + sessionId } };

        const p = new Promise((resolve, reject) => {
            axios.post(`${apiUrl}/api/1.0/resource`, data, config)
                .then(response => {
                    resolve(response.data);
                })
                .catch(error => {
                    reject({ header: "Erreur!", message: error.message });
                })
        });
        return p;
    };
};

// ######################################################################
//                              EXPORT
// ######################################################################
export default {
    title: {update: update_title},
    templates: { get: get_templates },
    template: { get: get_template_svg },
    projects: { get: get_projects },
    workspace: { get: get_workspace, create: post_workspace, create_workspace_from_available: create_workspace_from_available, login_user: login_user, create_user_box : create_user_box , workspace_upload: workspace_upload_workspace_from_available, update: put_workspace, delete: delete_workspace },
    ressource: { get: get_ressource, create: post_ressource, update: post_ressource, delete: delete_ressource },
    user: { get: get_user, create: post_user, update: post_user, delete : delete_user }
};
