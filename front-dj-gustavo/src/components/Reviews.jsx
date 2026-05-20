export default function Reviews() {
    return (
        <section className="py-12 bg-surface-container-low border-y border-white/5">
            <div className="max-w-7xl mx-auto px-4 md:px-margin-desktop flex flex-wrap justify-center gap-12 opacity-70 grayscale hover:grayscale-0 transition-all">
                <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                    <span className="font-label-md text-label-md uppercase tracking-tighter">Google Reviews 4.9/5</span>
                </div>
                <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>thumb_up</span>
                    <span className="font-label-md text-label-md uppercase tracking-tighter">Facebook Rated Excellent</span>
                </div>
                <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-tertiary" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                    <span className="font-label-md text-label-md uppercase tracking-tighter">Verified CDMX Producer</span>
                </div>
            </div>
        </section>
    );
}