import { ChangeEvent, useState } from "react";

export default function useTextarea() {
    const [value, setValue] = useState("");

    function onChange(e: ChangeEvent<HTMLTextAreaElement>) {
        setValue(e.target.value);
    }

    function setMyValue(value: string) {
        setValue(value);
    }

    return { value, onChange, setMyValue };
}
