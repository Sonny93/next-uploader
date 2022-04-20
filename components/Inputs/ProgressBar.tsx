import { ProgressUpload } from "../../front";

interface ProgressBarProps {
    name: string;
    label?: string;
    fieldClass?: string;
    progress: ProgressUpload;
    children?: any;
}

export default function ProgressBar({ name, label, fieldClass = '', progress, children }: ProgressBarProps) {
    const inProgressColor = '#3f88c5';
    const finishColor = '#00bd00';

    return (<div className={`progress-field ${fieldClass}`}>
        {label && (
            <label htmlFor={name}>
                {label}
            </label>
        )}
        <div className="progress-wrapper">
            <span>
                {progress.percent} %
            </span>
            <div className="details">
                {children}
            </div>
        </div>
    </div>);
}