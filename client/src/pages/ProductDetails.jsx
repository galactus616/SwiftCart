
import React, { useState, useEffect } from 'react';

// --- Sample Data Structure ---
// All product-specific data is now in this single object.
// This is the structure you would expect from a backend API.
const productData = {
    id: 1,
    name: 'Amul Masti Pouch Curd',
    brand: 'Amul',
    category: 'Dairy & Yogurt',
    deliveryTime: '10 MINS',
    description: 'Amul Masti Dahi is a delicious, creamy, and healthy curd that is perfect for any meal. Made from pasteurized toned milk, it is a rich source of calcium and protein, and contains active cultures that aid digestion.',
    disclaimer: 'Every effort is made to maintain accuracy of all information. However, actual product packaging and materials may contain more and/or different information. It is recommended not to solely rely on the information presented.',
    images: [
        'https://placehold.co/500x500/F0F9FF/1E40AF?text=Amul+Dahi',
        'https://placehold.co/500x500/E0F2FE/1E40AF?text=Nutrition',
        'https://placehold.co/500x500/BAE6FD/1E40AF?text=Packaging',
        'https://placehold.co/500x500/7DD3FC/1E40AF?text=Serving',
    ],
    variants: [
        { sku: 'AMUL-CURD-200', weight: '200 g', price: 20.00 },
        { sku: 'AMUL-CURD-500', weight: '500 g', price: 48.00 },
        { sku: 'AMUL-CURD-1KG', weight: '1 kg', price: 77.00 },
    ],
    highlights: [
        { title: 'Type', value: 'Curd' },
        { title: 'Unit', value: '200 g' },
    ]
};


// This component receives the product data via props.
const ProductDetails = ({ product }) => {
    const [selectedVariant, setSelectedVariant] = useState(product.variants && product.variants.length > 0 ? product.variants[0] : null);
    const [mainImage, setMainImage] = useState(product.images[0]);
    const [isDetailsVisible, setIsDetailsVisible] = useState(false);

    // Effect to update the selection if the main product prop changes
    useEffect(() => {
        setSelectedVariant(product.variants[0]);
        setMainImage(product.images[0]);
    }, [product]);

    const toggleDetails = (event) => {
        event.preventDefault();
        setIsDetailsVisible(!isDetailsVisible);
    };

    return (
        <div className="container mx-auto p-4 md:p-8">
            {/* Main Product Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
                {/* Left Column: Image Gallery */}
                <div>
                    <div className="aspect-square bg-white rounded-xl border border-gray-200 flex items-center justify-center p-4 mb-4">
                        <img src={mainImage} alt={product.name} className="max-w-full max-h-full object-contain" />
                    </div>
                    <div className="grid grid-cols-5 gap-3">
                        {product.images.map((img, index) => (
                            <div 
                                key={index} 
                                className={`aspect-square bg-white rounded-lg border-2 p-1 cursor-pointer ${mainImage === img ? 'border-green-500' : 'border-gray-200'}`}
                                onClick={() => setMainImage(img)}
                            >
                                <img src={img} alt={`Thumbnail ${index + 1}`} className="w-full h-full object-contain rounded-md" />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right Column: Product Information */}
                <div>
                    <p className="text-sm text-gray-500 mb-2">Home / {product.category} / {product.name}</p>
                    <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
                    <div className="flex items-center text-sm text-gray-600 font-medium my-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.414-1.414L11 9.586V6z" clipRule="evenodd" />
                        </svg>
                        {product.deliveryTime}
                    </div>
                    
                    <p className="text-md font-semibold text-gray-800 mb-3">Select Unit</p>
                    <div className="flex flex-wrap gap-3">
                        {product.variants.map((variant) => (
                            <button 
                                key={variant.sku}
                                onClick={() => setSelectedVariant(variant)}
                                className={`px-5 py-3 rounded-lg border-2 transition-all text-left ${selectedVariant.sku === variant.sku ? 'border-green-600 bg-green-50' : 'border-gray-300 bg-white hover:border-green-500'}`}
                            >
                                <p className="font-bold text-gray-800">{variant.weight}</p>
                                <p className="text-sm text-gray-600">₹{variant.price.toFixed(2)}</p>
                            </button>
                        ))}
                    </div>

                    <div className="mt-8 pt-6 border-t border-gray-200 flex justify-between items-center">
                        <div>
                            <p className="text-3xl font-extrabold text-gray-900">₹{selectedVariant.price.toFixed(2)}</p>
                            <p className="text-xs text-gray-500">(Inclusive of all taxes)</p>
                        </div>
                        <button className="w-1/2 bg-green-600 text-white font-bold text-lg py-4 px-6 rounded-xl hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 transition-colors duration-300">
                            Add to cart
                        </button>
                    </div>
                    
                    {/* --- Static Section --- */}
                    <div className="mt-8">
                        <h3 className="font-bold text-lg mb-4 text-gray-800">Why shop from us?</h3>
                        <div className="space-y-4">
                            <div className="flex items-start"><img src="https://placehold.co/40x40/FEF3C7/FBBF24?text=🚀" alt="Superfast Delivery" className="w-10 h-10 rounded-full mr-4" /><div><h4 className="font-semibold text-gray-800">Superfast Delivery</h4><p className="text-sm text-gray-600">Get your order delivered to your doorstep at the earliest from dark stores near you.</p></div></div>
                            <div className="flex items-start"><img src="https://placehold.co/40x40/D1FAE5/34D399?text=💰" alt="Best Prices" className="w-10 h-10 rounded-full mr-4" /><div><h4 className="font-semibold text-gray-800">Best Prices & Offers</h4><p className="text-sm text-gray-600">Best price destination with offers directly from the manufacturers.</p></div></div>
                            <div className="flex items-start"><img src="https://placehold.co/40x40/E0E7FF/818CF8?text=🛍️" alt="Wide Assortment" className="w-10 h-10 rounded-full mr-4" /><div><h4 className="font-semibold text-gray-800">Wide Assortment</h4><p className="text-sm text-gray-600">Choose from 5000+ products across food, personal care, household & other categories.</p></div></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Highlights & Product Details Section */}
            <div className="mt-12 lg:mt-16 bg-white p-6 rounded-xl border border-gray-200">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Highlights</h2>
                <div className="text-sm text-gray-700">
                    {product.highlights.map(highlight => (
                        <p key={highlight.title}><span className="font-semibold w-24 inline-block">{highlight.title}</span> {highlight.value}</p>
                    ))}
                </div>
                
                <div className={`details-content ${isDetailsVisible ? 'show' : ''} mt-4 pt-4 border-t border-gray-200 text-sm text-gray-700 space-y-4`}>
                    <div><h4 className="font-semibold mb-1">Description</h4><p>{product.description}</p></div>
                    <div><h4 className="font-semibold mb-1">Disclaimer</h4><p>{product.disclaimer}</p></div>
                </div>

                <a href="#" onClick={toggleDetails} className="text-sm font-semibold text-green-600 mt-4 inline-block">
                    <span>{isDetailsVisible ? 'View less details' : 'View more details'}</span>
                    <span>{isDetailsVisible ? ' ▲' : ' ▼'}</span>
                </a>
            </div>

            {/* --- Static Section --- */}
            <div className="mt-12 lg:mt-16">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Top 10 products in this category</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                    {/* Placeholder for related products */}
                    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300 flex flex-col">
                        <div className="p-2"><img src="https://placehold.co/400x400/F0F9FF/0284C7?text=MD+Curd" alt="Related Product" className="w-full h-auto object-cover rounded-lg" /></div>
                        <div className="p-4 flex flex-col flex-grow">
                            <div className="flex items-center text-xs text-gray-500 font-medium mb-2"><svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5 text-gray-400" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.414-1.414L11 9.586V6z" clipRule="evenodd" /></svg>10 MINS</div>
                            <h3 className="text-sm font-semibold text-gray-800 leading-tight h-10">Mother Dairy Classic Cup Curd</h3>
                            <p className="text-xs text-gray-500 mt-1">400 g</p>
                            <div className="mt-4 flex justify-between items-center"><p className="text-base font-bold text-gray-900">₹50.00</p><button className="border-2 border-green-600 text-green-700 font-bold text-sm py-2 px-6 rounded-lg hover:bg-green-50 transition-colors duration-300">ADD</button></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// The App component demonstrates how to use the ProductDetails.
// It passes the single `productData` object as a prop.
export default function App() {
    return (
        <>
            <style>{`
                body {
                    font-family: 'Inter', sans-serif;
                    background-color: #f9fafb;
                }
                .details-content {
                    transition: max-height 0.5s ease-in-out, opacity 0.5s ease-in-out;
                    max-height: 0;
                    overflow: hidden;
                    opacity: 0;
                }
                .details-content.show {
                    max-height: 500px; /* Adjust as needed */
                    opacity: 1;
                }
            `}</style>
            <ProductDetails product={productData} />
        </>
    );
};
