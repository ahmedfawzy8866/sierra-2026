
import { Client, ClientStatus, InventoryItem } from './types';

export const LOGO_URL = "https://lh3.googleusercontent.com/aida-public/AB6AXuDo1woA6ddU8FJqEKlbmyVtWoqHtXJ6iKO-5_l2FAHl2dxvK3Z3OABBriDtZwWtbvN_UeAstiibhtzFhazaI6YIdHrXPxqHm1xmznXleBGnNYVBpJz5FGKfoGfqoQkLHAJYU4EDFQtTAE7qM-agZUXWP1cDiFglZm4wmMwT6WkBkDpzgciGF9Av-bzlBY9wEyMBgAykFeuNxZVTZCoeXJR0oV6Z81We0-e5_zTgwbaU55Wxw4wfsZq3Y3jxvNbK0H-tgDzH8U6FpLw";

export const MOCK_CLIENTS: Client[] = [
  {
    id: '1',
    name: 'Alexander Rossi',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    lastContact: '2 hours ago',
    status: ClientStatus.HOT,
    budget: '$2.5M - $3.8M',
    area: 'Palm Jumeirah, Dubai',
    phone: '+971 50 123 4567'
  },
  {
    id: '2',
    name: 'Elena Rodriguez',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
    lastContact: 'Yesterday',
    status: ClientStatus.SIGNED,
    budget: '$4.2M',
    area: 'Downtown Penthouse',
    phone: '+971 52 987 6543'
  },
  {
    id: '3',
    name: 'Marcus Sterling',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
    lastContact: 'Oct 24, 2023',
    status: ClientStatus.SEARCHING,
    budget: '$1.2M - $1.8M',
    area: 'Marina Waterfront',
    phone: '+971 55 555 1212'
  }
];

export const MOCK_INVENTORY: InventoryItem[] = [
  {
    id: 'p1',
    title: 'Modern Villa in Mivida',
    price: '38,000,000 EGP',
    location: 'Mivida, New Cairo',
    beds: 5,
    baths: 6,
    sqft: '450',
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80',
    status: 'Available',
    description: 'A masterpiece of contemporary architecture in Mivida. Features lush private gardens, premium finishing, and is located in the most exclusive parcel. Ready to move in.'
  },
  {
    id: 'p2',
    title: 'Standalone Villa in Hyde Park',
    price: '28,500,000 EGP',
    location: 'Hyde Park, New Cairo',
    beds: 4,
    baths: 5,
    sqft: '380',
    image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=800&q=80',
    status: 'Available',
    description: 'Luxurious standalone villa directly overlooking the park. Includes space for a private pool, a driver room, maid room, and grand reception area.'
  },
  {
    id: 'p3',
    title: 'Twin House in Mountain View iCity',
    price: '22,000,000 EGP',
    location: 'MV iCity, New Cairo',
    beds: 4,
    baths: 4,
    sqft: '290',
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80',
    status: 'Reserved',
    description: 'Beautiful twin house located in the Mountain Park zone. Prime location with a massive private garden and stunning roof terrace overlooking the lagoon.'
  },
  {
    id: 'p4',
    title: 'Signature Villa in Villette Sodic',
    price: '45,000,000 EGP',
    location: 'Villette, New Cairo',
    beds: 6,
    baths: 7,
    sqft: '600',
    image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80',
    status: 'Available',
    description: 'Ultra-luxury Signature Villa in Villette. Double height ceilings, huge basement with cinema room, private pool, and imported marble floors.'
  }
];
