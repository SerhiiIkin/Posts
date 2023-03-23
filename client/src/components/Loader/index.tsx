import "./style.css";

function Loader({ className="" }: { className?: string }) {
    return (
        <span className={`lds-spinner ${className}`}>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
        </span>
    );
}

export default Loader;
