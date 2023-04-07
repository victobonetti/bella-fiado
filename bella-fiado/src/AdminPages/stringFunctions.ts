export function removeAcentosEMaiusculas(inputString:string) {
    // remove os acentos
    const semAcentos = inputString.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  
    // remove as letras maiusculas
    const semMaiusculas = semAcentos.toLowerCase();
  
    return semMaiusculas;
  }