import React, { useState, useEffect } from 'react';
import { useHelia } from '../context/HeliaContext';
import { getImage } from '../utils/ipfs';


interface ImageIPFSProps {
    image: string;
    alt: string;
    className?: string;
}

export const ImageIPFS: React.FC<ImageIPFSProps> = ({
    image,
    alt = '',
    className = ''
}) => {
    const [localImage, setLocalImage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const ctx = useHelia();

    useEffect(() => {
        const fetchImage = async () => {
            const url = await getImage(ctx, image)
            setIsLoading(false)
            setLocalImage(url)
        };
        fetchImage();
    }, [image]);

    if (isLoading) {
        return (
            <img
                src="/loading.gif"
                alt={alt}
                className={className}
            />
        );
    } else {
        return (
            <img
                src={localImage!}
                alt={alt}
                className={className}
            />
        );
    }
}