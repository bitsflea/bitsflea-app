import { Sparkles, Smartphone, Gamepad2, Sparkle, Home, Shirt, BookOpen, Album } from 'lucide-react';

export const categories = [
    { name: 'Featured', icon: Sparkles, value: undefined },
    { name: 'Electronics', icon: Smartphone, value: 1 },
    { name: 'Toys', icon: Gamepad2, value: 2 },
    { name: 'Beauty', icon: Sparkle, value: 3 },
    { name: 'Home', icon: Home, value: 4 },
    { name: 'Fashion', icon: Shirt, value: 5 },
    { name: 'Books', icon: BookOpen, value: 6 },
    { name: 'Virtual', icon: Album, value: 7 }
];

export function getCategoryByValue(value: number) {
    const item = categories.find(category => category.value === value)
    if (item) return item.name
    return categories[0].name
}