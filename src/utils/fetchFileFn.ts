type Method = "POST" | "PUT";

interface Options {
    externalUrl?: boolean;
    method?: Method;
    formData: FormData;
}

async function fetchFileFn(endpoint: string, options?: Options) {
    try {
        const { externalUrl, method, formData } = options ?? {};

        const res = await fetch(
            externalUrl ? endpoint : process.env.NEXT_PUBLIC_API_URL + endpoint,
            {
                method: method ?? "POST",
                body: formData,
            }
        );

        const response = await res.json();

        return {
            code: res.status,
            data: response,
        };
    } catch (e) {
        return {
            code: 999,
            error: true,
            e,
        };
    }
}

export default fetchFileFn;