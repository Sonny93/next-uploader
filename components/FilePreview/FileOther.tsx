import Image from 'next/image';

import { GetIcon } from '../../utils';
import { FileFront } from '../../front';

import styles from '../../styles/file-preview/file-preview.module.scss';

export default function FileOther({ file }: { file: FileFront }) {
    const { meta } = file;
    const className = `${styles['preview-wrapper']} ${styles['file-other']}`;
    return (<>
        <div className={className}>
            <Image
                src={GetIcon(meta.type)}
                alt={`${meta.type} icon`}
                height={128}
                width={128}
            />
            <span>
                {meta.type}
            </span>
        </div>
    </>);
}