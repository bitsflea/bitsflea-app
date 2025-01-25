import React, { useState, useEffect } from 'react';
import { UserExtendInfo } from '../types';
import { getUserExtendInfo } from '../utils/ipfs';
import { useHelia } from '../context/HeliaContext';

interface ExtendInfoProps {
    extendInfo: string
    className: string
}

export const ExtendInfo: React.FC<ExtendInfoProps> = ({ extendInfo, className }) => {
    const [userExtendInfo, setUserExtendInfo] = useState<UserExtendInfo>({ x: "", tg: "", e: "", d: "" })
    const ctx = useHelia();

    useEffect(() => {
        const fetchUserExtendInfo = async () => {
            if (!extendInfo) return;
            const info = await getUserExtendInfo(ctx, extendInfo);
            // console.log("info:", info)
            setUserExtendInfo(info);
        };
        fetchUserExtendInfo();
    }, [extendInfo])

    return (<p className={className}>{userExtendInfo.d}</p>)
}