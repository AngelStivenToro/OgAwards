export const validateString = (
    value: any,
    type: "str" | "int" | "date" = "str"
) => {
    if (value === "" || !value) return null;

    if (type === "str") {
        return value.toString().trim();
    }

    if (type === "int") {
        const result = isNaN(value) ? 0 : Math.trunc(Number(value));

        if (result === 0) return null;

        return result;
    }

    if (type === "date") {
        if (isNaN(Date.parse(value))) return null;

        return value.toString().trim();
    }
};

export const emptyValue = (value: any, type: "str" | "int" = "str") => {
    if (!value) return true;

    if (type === "str") {
        if (value === "") return true;

        return false;
    }

    if (type === "int") {
        const result = isNaN(value) ? 0 : Math.trunc(Number(value));

        if (result === 0) return true;

        return false;
    }
};

export const includesString = (arrayToFind: string[], strings: string[]) => {
    const result = [];

    for (const value of strings) {
        result.push(arrayToFind.includes(value));
    }

    return result.includes(true) ? true : false;
};

export const stringIncludes = (text: string, equalValue: string[]) => {
    const result = [];

    for (const value of equalValue) {
        result.push(text === value);
    }

    return result.includes(true) ? true : false;
};

export function passwordSecurity(contrasena: string | number): number {
    const password = String(contrasena);
    const nivelesSeguridad = 4;
    let puntajeSeguridad = 0;

    const requisitosMinimos = [
        password.length >= 8,
        /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(password),
        /[a-z]/.test(password),
        /[A-Z]/.test(password),
    ];

    for (const requisito of requisitosMinimos) {
        if (requisito) {
            puntajeSeguridad++;
        }
    }

    if (contrasena == null) return 0;

    puntajeSeguridad = Math.min(puntajeSeguridad, nivelesSeguridad);
    return puntajeSeguridad;
}

export function encriptarCorreo(correo: string): string {
    const [usuario, dominio] = correo.split('@');
    const primeraLetra = usuario.slice(0, 4);
    const nombreOculto = primeraLetra + '*'.repeat(usuario.length - 1);

    const correoOculto = `${nombreOculto}@${dominio}`;
    return correoOculto;
}

export const deleteAccents = (text: string) => {
    // WITHOUT ACCENTS IN CAPITAL LETTERS
    let result = text
        .replace("Á", "A")
        .replace("É", "E")
        .replace("Í", "I")
        .replace("Ó", "O")
        .replace("Ú", "U");

    // WITHOUT ACCENTS IN LOWERCASE LETTERS
    result = result
        .replace("á", "a")
        .replace("é", "e")
        .replace("í", "i")
        .replace("ó", "o")
        .replace("ú", "u");

    return result;
};

export const formatDate = (date: string | null, withTime: boolean = false) => {
    if (!date) return "No registra";

    const year = date.substring(0, 4);
    const month = date.substring(5, 7);
    const day = date.substring(8, 10);

    const finalDate = day + "/" + month + "/" + year;
    if (!withTime) return finalDate;

    const time = date.substring(11, 16);
    return finalDate + ` ${time}`;
};

export const convertToCurrency = (value: any) => {
    if (value === "" || !value || value === null || isNaN(Number(value)))
        return "$0";

    const formatter = new Intl.NumberFormat("en-US", {
        style: "currency",
        minimumFractionDigits: 2,
        currency: "USD",
    });

    let currentValue = formatter.format(Number(value));
    currentValue = currentValue.substring(0, currentValue.length - 3);

    return currentValue.replaceAll(",", ".");
};

export const stringToUpperCase = (
    text: string | null,
    cleanAccents: boolean = false
) => {
    const validatedText = validateString(text);

    if (!validatedText) return null;

    if (cleanAccents) return deleteAccents(validatedText).toUpperCase();

    return validatedText.toUpperCase();
};

export const stringToLowerCase = (
    text: string | null,
    cleanAccents: boolean = false
) => {
    const validatedText = validateString(text);

    if (!validatedText) return null;

    if (cleanAccents) return deleteAccents(validatedText).toLowerCase();

    return validatedText.toLowerCase();
};

export const verifyLetters = (text: string | number | null): string | null => {
    if (text === null) return "";

    if (!/^[a-zA-ZÀ-ÿ\u00f1\u00d1 ]+$/g.test(String(text))) return null;

    return String(text).trim();
};

export const verifyNumbers = (value: string | number | null): number | null => {
    if (value === null) return 0;

    if (!/^[0-9,$]*$/g.test(String(value))) return null;

    return Number(value);
};

export const emptyArray = (value: any[]): boolean => {
    if (!value) return true;

    if (value.length < 1) return true;

    return false;
};

export const formatTime = (time: string | null) => {
    if (!time) return "No registra";

    const hour = Number(time.substring(0, 2));
    const minutes = time.substring(3, 5);

    const schedule = (!isNaN(hour) ? hour : 0) < 12 ? "AM" : "PM";

    const resultHour = hour > 12 ? String(hour - 12) : String(hour);

    return `${
        resultHour.length < 2 ? "0" + resultHour : resultHour
    }:${minutes} ${schedule}`;
};
