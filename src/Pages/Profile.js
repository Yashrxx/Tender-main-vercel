import './Profile.css';
import { useEffect, useState } from 'react';
import Select from 'react-select';

const Profile = (props) => {
  const companyCategories = [
    "Construction & Civil Works", "Information Technology (IT)", "Electrical Equipment & Works",
    "Healthcare & Medical Equipment", "Roads & Bridges", "Education & Training",
    "Consultancy Services", "Agriculture & Allied Services", "Transportation & Logistics",
    "Telecommunications", "Security Services", "Water Supply & Sanitation",
    "Office Equipment & Stationery", "Environmental Services", "Machinery & Industrial Supplies"
  ];

  const [formData, setFormData] = useState({
    name: '', website: '', industry: '', description: '', address: '',
    email: '', phone: '', logo: null, coverImage: null
  });

  const [preview, setPreview] = useState({ logo: '', coverImage: '' });
  const [isEditing, setIsEditing] = useState(false);
  const [profileExists, setProfileExists] = useState(false);
  const [loading, setLoading] = useState(true);
  const [logoFile, setLogoFile] = useState(null);
  const [coverFile, setCoverFile] = useState(null);

  const fetchProfile = async () => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user?.email || !token) {
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`/api/companies?email=${user.email}`, {
        headers: { 'auth-token': token }
      });

      const data = await res.json();

      if (res.ok && data) {
        setFormData({
          name: data.name || '', website: data.website || '', industry: data.industry || '',
          description: data.description || '', address: data.address || '',
          email: data.email || user.email, phone: data.phone || '',
          logo: null, coverImage: null
        });        setPreview({
          logo: data.logo || 'https://ui-avatars.com/api/?name=Company&background=6366f1&color=fff&size=200&bold=true&format=png',
          coverImage: data.coverimage || 'https://picsum.photos/seed/default/800/300'
        });

        setProfileExists(true);
        setIsEditing(false);
      } else {
        throw new Error(data?.error || 'Profile not found');
      }
    } catch (err) {
      const fallback = {
        name: 'yash',
        website: 'https://yashrx@gmail.com',
        industry: 'Fashion Design',
        description: 'Fashion Designer Studio for men and women of all ages and all body types..',
        address: 'Nattu pilliyar koil Street , Sowcarpet , chennai -01',
        email: user?.email || '',
        phone: '9789800288',
        logo: null,
        coverImage: null
      };

      setFormData(fallback);      setPreview({
        logo: 'https://ui-avatars.com/api/?name=Company&background=6366f1&color=fff&size=200&bold=true&format=png',
        coverImage: 'https://picsum.photos/seed/default/800/300'
      });

      setProfileExists(false);
      setIsEditing(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    const file = files[0];
    if (!file) return;

    const previewURL = URL.createObjectURL(file);
    if (name === 'logo') {
      setFormData((prev) => ({ ...prev, logo: file }));
      setPreview((prev) => ({ ...prev, logo: previewURL }));
      setLogoFile(file);
    } else if (name === 'coverImage') {
      setFormData((prev) => ({ ...prev, coverImage: file }));
      setPreview((prev) => ({ ...prev, coverImage: previewURL }));
      setCoverFile(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('token');
    if (!token) {
      alert("You're not logged in. Please log in again.");
      return;
    }

        // Send JSON (not FormData) — Vercel serverless functions don't parse multipart
    const submitData = {
      name: formData.name,
      website: formData.website,
      industry: formData.industry,
      description: formData.description,
      address: formData.address,
      phone: formData.phone
    };

    const method = profileExists ? 'PUT' : 'POST';

    try {
      const res = await fetch(`/api/companies`, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'auth-token': token
        },
        body: JSON.stringify(submitData)
      });

      const result = await res.json();

      if (res.ok) {
        alert('Profile saved successfully');
        setIsEditing(false);
        setProfileExists(true);
        fetchProfile();
      } else {
        alert(result.error || 'Something went wrong');
      }
    } catch {
      alert('Failed to submit profile');
    }
  };

  if (loading) return <div className="loading-spinner"></div>

  return (
    <div className="container" style={{ backgroundColor: props.mode === 'dark' ? '#4b5563' : 'white'}}>
      <h1 style={{ color: props.mode === 'dark' ? 'white' : 'black', fontWeight: "bold" }}>Company Profile</h1>
      <p className="subtext" style={{ color: props.mode === 'dark' ? 'white' : 'black'}}>Manage your company's information and settings.</p>

      <form className="form" onSubmit={handleSubmit}>
        <label style={{ color: props.mode === 'dark' ? 'white' : 'black'}}>Company Name</label>
        <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Enter company name" disabled={profileExists && !isEditing} />

        <label style={{ color: props.mode === 'dark' ? 'white' : 'black'}}>Company Website</label>
        <input type="text" name="website" value={formData.website} onChange={handleChange} placeholder="Enter website URL" disabled={profileExists && !isEditing} />

        <label htmlFor="category" style={{ color: props.mode === 'dark' ? 'white' : 'black'}}>Industry</label>
        <Select
          options={companyCategories.map(cat => ({ value: cat, label: cat }))}
          value={formData.industry ? { value: formData.industry, label: formData.industry } : null}
          onChange={(selectedOption) => setFormData({ ...formData, industry: selectedOption.value })}
          placeholder="Select industry"
          isDisabled={profileExists && !isEditing}
          styles={{ menuList: (base) => ({ ...base, maxHeight: 150, overflowY: 'auto' }) }}
        />

        <label style={{ color: props.mode === 'dark' ? 'white' : 'black'}}>Company Description</label>
        <textarea rows="4" name="description" value={formData.description} onChange={handleChange} placeholder="Enter description" disabled={profileExists && !isEditing}></textarea>

        <label style={{ color: props.mode === 'dark' ? 'white' : 'black'}}>Address</label>
        <input type="text" name="address" value={formData.address} onChange={handleChange} placeholder="Enter address" disabled={profileExists && !isEditing} />

        <label style={{ color: props.mode === 'dark' ? 'white' : 'black'}}>Contact Email</label>
        <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Enter email address" disabled={profileExists && !isEditing} />

        <label style={{ color: props.mode === 'dark' ? 'white' : 'black'}}>Contact Phone</label>
        <input type="text" name="phone" value={formData.phone} onChange={handleChange} placeholder="Enter phone number" disabled={profileExists && !isEditing} />

        <div className="upload-section">
          <label style={{ color: props.mode === 'dark' ? 'white' : 'black'}}>Logo</label>
          <input type="file" name="logo" accept="image/*" onChange={handleFileChange} disabled={profileExists && !isEditing} />
          {(logoFile || formData.logo instanceof File) && <p className="filename">{(logoFile || formData.logo).name}</p>}
          {preview.logo && <img src={preview.logo} alt="Logo Preview" width="100" />}
        </div>

        <div className="upload-section">
          <label style={{ color: props.mode === 'dark' ? 'white' : 'black'}}>Cover Image</label>
          <input type="file" name="coverImage" accept="image/*" onChange={handleFileChange} disabled={profileExists && !isEditing} />
          {(coverFile || formData.coverImage instanceof File) && <p className="filename">{(coverFile || formData.coverImage).name}</p>}
          {preview.coverImage && <img src={preview.coverImage} alt="Cover Preview" width="200" />}
        </div>

        {(!profileExists || isEditing) && (
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1rem' }}>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? "Publishing..." : profileExists ? "Save Changes" : "Create Profile"}
            </button>
          </div>
        )}
      </form>

      {profileExists && !isEditing && (
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1rem' }}>
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            className="btn btn-primary"
          >
            Edit Profile
          </button>
        </div>
      )}

    </div>
  );
};

export default Profile;