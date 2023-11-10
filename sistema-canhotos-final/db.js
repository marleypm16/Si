import postgres from "postgres";
import "dotenv/config";
let { PGHOST, PGDATABASE, PGUSER, PGPASSWORD, ENDPOINT_ID } = process.env;

console.log(PGHOST);
console.log(PGPASSWORD);
const sql = postgres({
  host: PGHOST,
  database: PGDATABASE,
  username: PGUSER,
  password: PGPASSWORD,
  port: 5432,
  ssl: "require",
  connection: {
    options: `project=${ENDPOINT_ID}`,
  },
});

export const get_emissores = async () => {
  try {
    const response = await sql`SELECT * FROM emissores`;
    return response;
  } catch (error) {
    throw error;
  }
};

export const get_emissores_especificos = async (id) => {
  try {
    const response = await sql`SELECT * FROM emissores WHERE id = ${id}`;
    return response;
  } catch (error) {
    throw error;
  }
}

export const new_emissor = async (body) => {
  try {
    const { razao_social, cnpj } = body;
    const response = await sql`INSERT INTO EMISSORES (razao_social, cnpj)
    VALUES (${razao_social},${cnpj})`;
    return response;
  } catch (error) {
    throw error;
  }
};

export const get_notas = async () => {
  try {
    const response = await sql`SELECT * FROM notas`;
    return response;
  } catch (error) {
    throw error;
  }
};
  
export const get_notas_especificas_num_nota_id_emissor = async (id) => {
  try {
    const VerificarSeHaDigitos = /^[0-9]+$/; // Expressão regular para verificar se contém somente dígitos

    if (VerificarSeHaDigitos.test(id)) {
      // Se o ID contém apenas dígitos (números)
      const response = await sql`SELECT * FROM notas WHERE numero_da_nota = ${id}`;
      return response;
    } else {
      // Se o ID contém caracteres que não são números (letras, etc.)
      const response = await sql`SELECT * FROM notas WHERE id_emissor = ${id}`;
      return response;
    }
  } catch (error) {
    throw error;
  }
}



// export const get_notas_especificas_alterar = async (id) =>{
//   try {
//     const response = await sql`SELECT * FROM notas WHERE numero_da_nota = ${id}`;
//     return response;
//   } catch (error) {
//     throw error;
//   }
// }

export const atualizarNotas = async (body,id) => {
  const {numero_da_nota,status,data,motorista,imagem_path} = body
  try {
    const response = await sql`UPDATE notas SET numero_da_nota = ${numero_da_nota},status = ${status}, data=${data},motorista = ${motorista},imagem_path = ${imagem_path}  WHERE numero_da_nota = ${id}`;
    return response;
  } catch (error) {
    throw error;
  }
}

export const nova_nota = async (body) => {
  try {
    const { numero_da_nota, motorista,status,data,id_emissor } = body;
    const response = await sql`INSERT INTO notas (data, id_emissor,motorista,numero_da_nota,status)
    VALUES (${data},${id_emissor},${motorista},${numero_da_nota},${status})`;
    return response;
  } catch (error) {
    throw error;
  }
};

export const DeletarNota = async (id) =>{
  try {
    const response = await sql`DELETE FROM notas WHERE numero_da_nota = ${id}`;
    return response;
  } catch (error) {
    throw error;
  }
}