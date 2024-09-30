import { getMenuItems } from '@/commons/commonService';

export const useMenuItems = () => {  
    return useState('menuItems', () => getMenuItems());
};