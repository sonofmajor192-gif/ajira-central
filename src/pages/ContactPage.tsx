import React, { useState } from "react";
import { motion } from "motion/react";
import { Mail, Phone, MapPin, Send, CheckCircle2 } from "lucide-react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  });
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    setIsSubmitting(true);
    // Simulate API delay
    setTimeout(() => {
      console.log("Contact submission sent:", formData);
      setIsSubmitting(false);
      setSubmitted(true);
      setFormData({ name: "", email: "", message: "" });
    }, 1000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="max-w-6xl mx-auto px-4 py-16 sm:px-6 lg:px-8"
    >
      <div className="text-center mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-100 text-xs font-bold uppercase tracking-widest mb-4">
          <Mail className="w-3.5 h-3.5" />
          Get In Touch
        </div>
        <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight uppercase leading-none">
          Contact<span className="text-blue-700">Us</span>
        </h1>
        <p className="mt-4 text-lg text-slate-600 font-medium max-w-xl mx-auto">
          Have an inquiry, feedback, or need to verify a listing? Our team is ready to assist.
        </p>
      </div>

      <div className="grid md:grid-cols-12 gap-12 items-start">
        {/* Info panel */}
        <div className="md:col-span-5 space-y-6">
          <div className="bg-white border border-slate-200/80 rounded-3xl p-8 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 uppercase tracking-tight mb-6">Contact Channels</h3>
            
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-700 shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Email Correspondence</h4>
                  <a href="mailto:info@ajiracentral.co.tz" className="text-sm font-semibold text-slate-700 hover:text-blue-700 transition-colors">
                    info@ajiracentral.co.tz
                  </a>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-700 shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Call Support</h4>
                  <p className="text-sm font-semibold text-slate-700">
                    +255 700 000 000
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-700 shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Location</h4>
                  <p className="text-sm font-semibold text-slate-700 leading-snug">
                    Dar es Salaam, Tanzania
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-slate-900 text-white rounded-3xl p-8 border border-slate-800 shadow-lg">
            <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Office Hours</h4>
            <div className="space-y-2 text-sm font-medium">
              <div className="flex justify-between border-b border-slate-800 pb-2">
                <span className="text-slate-400">Monday - Friday</span>
                <span>8:00 AM - 5:00 PM</span>
              </div>
              <div className="flex justify-between pt-1">
                <span className="text-slate-400">Saturday</span>
                <span>9:00 AM - 1:00 PM</span>
              </div>
            </div>
          </div>
        </div>

        {/* Form panel */}
        <div className="md:col-span-7">
          <div className="bg-white border border-slate-200/80 rounded-3xl p-8 md:p-10 shadow-sm relative overflow-hidden">
            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-12 flex flex-col items-center text-center"
              >
                <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mb-6 border border-emerald-100 shadow-sm">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight mb-2">Message Dispatched</h3>
                <p className="text-slate-500 font-medium text-sm max-w-sm mb-6 leading-relaxed">
                  Thank you for reaching out to Ajira Central. Our administration team has received your inquiry and will revert shortly.
                </p>
                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="px-6 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold uppercase tracking-wider hover:bg-slate-55 transition-all shadow-sm"
                >
                  Send another message
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Your Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter full name"
                    className="w-full px-4 py-3 bg-slate-50 rounded-2xl border border-slate-200 text-slate-800 placeholder-slate-400 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-600 transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="email" className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="name@domain.com"
                    className="w-full px-4 py-3 bg-slate-50 rounded-2xl border border-slate-200 text-slate-800 placeholder-slate-400 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-600 transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="message" className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Detailed Message
                  </label>
                  <textarea
                    id="message"
                    required
                    rows={5}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="How can we assist you today?"
                    className="w-full px-4 py-3 bg-slate-50 rounded-2xl border border-slate-200 text-slate-800 placeholder-slate-400 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-600 transition-all resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 px-6 rounded-2xl bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-colors duration-155 disabled:opacity-50"
                >
                  {isSubmitting ? "Processing..." : "Submit Message"}
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
