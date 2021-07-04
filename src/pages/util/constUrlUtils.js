
// Produção
//export const URL_BACKEND = "http://172.18.4.46:8080/sispen_api";
//export const URL_FRONTEND = "http://172.18.4.44:3000/";

//Desenvolvimento
// export const URL_BACKEND = "http://localhost:8080/meldica_backend";
// export const URL_FRONTEND = "http://localhost:8089/";

//Produção
export const URL_BACKEND = process.env.NODE_ENV === 'production' ? "https://meldica-backend.herokuapp.com" : "http://localhost:8081/meldica_backend";
export const URL_FRONTEND = process.env.NODE_ENV === 'production' ? "https://meldica-frontend.herokuapp.com/" : "http://localhost:8089/";
