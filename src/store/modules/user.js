import { getPublicKey, login } from "@/api/account";
import { logout, getInfo } from "@/api/user";
import { setToken, getToken, removeToken } from "@/utils/auth";
import { resetRouter } from "@/router";
import { UserAuth } from "@/entity/enums";
import { picSrc } from "@/utils/page";
import JSEncrypt from "jsencrypt";

const getDefaultState = () => {
  return {
    token: getToken(),
    username: "",
    avatar: "",
    roles: [],
  };
};

const state = getDefaultState();

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState());
  },
  SET_TOKEN: (state, token) => {
    state.token = token;
  },
  SET_USERNAME: (state, username) => {
    state.username = username;
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar;
  },
  ADD_ROLE: (state, authority) => {
    state.roles.push(authority);
  },
};

const actions = {
  // user login
  login({ commit }, form) {
    return new Promise((resolve, reject) => {
      getPublicKey()
        .then((response) => {
          const encryptor = new JSEncrypt();
          encryptor.setPublicKey(response.data);
          const encryptedPassword = encryptor.encrypt(form.password);

          return login(form.email, encryptedPassword, form.remember);
        })
        .then((response) => {
          const token = response.data;
          //   console.log(token);
          commit("SET_TOKEN", token);
          setToken(token);
          resolve();
        })
        .catch((error) => {
          reject(error);
        });
    });
  },

  // get user info
  getInfo({ commit }) {
    return new Promise((resolve, reject) => {
      getInfo()
        .then((response) => {
          const { data } = response;
          //   console.log(data);
          if (!data) {
            return reject("认证失败，请重新登录。");
          }

          const { username, avatar, authority } = data;

          commit("SET_USERNAME", username);
          commit("SET_AVATAR", picSrc(avatar));

          switch (authority) {
            case UserAuth.Admin:
              commit("ADD_ROLE", UserAuth.Admin);
            case UserAuth.Coach:
              commit("ADD_ROLE", UserAuth.Coach);
            case UserAuth.User:
              commit("ADD_ROLE", UserAuth.User);
              break;

            default:
              throw new Error("wrong authority");
          }

          resolve(data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },

  // user logout
  logout({ commit }) {
    return new Promise((resolve, reject) => {
      logout()
        .then(() => {
          removeToken(); // must remove  token  first
          resetRouter();
          commit("RESET_STATE");
          resolve();
        })
        .catch((error) => {
          reject(error);
        });
    });
  },

  // remove token
  resetToken({ commit }) {
    return new Promise((resolve) => {
      removeToken(); // must remove  token  first
      commit("RESET_STATE");
      resolve();
    });
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
