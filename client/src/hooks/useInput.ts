import { ChangeEvent, useState } from "react";

export default function useInput() {
    const [value, setValue] = useState<string>("");

    function onChange(e: ChangeEvent<HTMLInputElement>) {
        setValue(e.target.value);
    }

    function clear() {
        setValue("");
    }

    function onMyChange(value: string) {
        setValue(value);
    }

    return { value, onChange, clear, onMyChange };
}
