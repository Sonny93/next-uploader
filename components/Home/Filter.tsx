import { useEffect, useState } from 'react';
import { calculSize } from '../../utils';

import styles from '../../styles/home/filelist.module.scss';
import { FileFront } from '../../front';
import Input from '../Inputs/input';

interface FilterProps {
    globalSize: number;
    files: FileFront[];
    filesFilter: FileFront[];
    inputContent: string;
    setFilesFilter: (files: FileFront[]) => void;
    setInputContent: (value: string) => void;
    loadItems: () => void;
}

export default function Filter({ globalSize, files, filesFilter, inputContent, setFilesFilter, setInputContent, loadItems }: FilterProps) {
    const [filteredSize, setFilteredSize] = useState<number>(0);

    useEffect(() => {
        if (filesFilter.length < 1) {
            return setFilteredSize(0);
        }

        const size = filesFilter
            .map(({ passwordSet, size }) => Number(!passwordSet ? size?.raw : 0))
            .reduce((prev, next) => prev + next);

        setFilteredSize(size);
        loadItems();
    }, [filesFilter, setFilesFilter]);

    function onChange({ target }) {
        setInputContent(target.value);
        if (!files || files?.length < 1) return;

        const filesFiltered = files.filter((file) => file.name.toLowerCase().includes(target.value.toLowerCase()) ? file : false);
        setFilesFilter(filesFiltered);
    }

    return (
        <div className={styles['filter']}>
            <Input
                name='input_search'
                fieldClass={styles['wrapper']}
                labelComponent={<FilterSize
                    globalSize={globalSize}
                    filteredSize={filteredSize}
                    filesCount={filesFilter.length}
                />}
                onChangeCallback={onChange} value={inputContent}
                placeholder={`Rechercher parmi ${files.length} fichier(s)`}
            />
        </div>
    );
}

interface FilterSizeProps {
    globalSize: number;
    filteredSize: number;
    filesCount: number;
}
function FilterSize({ globalSize, filteredSize, filesCount }: FilterSizeProps) {
    const prettyFilteredSize = calculSize(filteredSize);
    const prettyGlobalSize = calculSize(globalSize);

    if (!globalSize) {
        return (<>0 fichier {calculSize(0)}</>);
    } else {
        return (<>
            <b>{filesCount} fichiers</b> ({filteredSize === globalSize ? prettyGlobalSize : `${prettyFilteredSize} — ${prettyGlobalSize}`})
        </>);
    }
}