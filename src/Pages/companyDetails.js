import { useLocation } from 'react-router-dom';
import './companyDetails.css';

const CompanyDetails = () => {
    const { state } = useLocation();
    const company = state?.company;

    if (!company) return <div>No company data found.</div>;

    return (
        <div className="company-details">            <img
                src={company.coverimage
                    ? company.coverimage
                    : 'https://picsum.photos/seed/default/600/200'}
                alt="Cover"
                className="cover-image"
            />            <img
                src={company.logo
                    ? company.logo
                    : 'https://ui-avatars.com/api/?name=' + encodeURIComponent(company.name || 'C') + '&background=6366f1&color=fff&size=200&bold=true&format=png'}
                alt="Logo"
                className="logo"
            />
            <h1 className="company-title">{company.name}</h1>

            <div className="company-details-table">
                <table>
                    <tbody>
                        <tr>
                            <th>Email:</th>
                            <td>{company.email}</td>
                        </tr>
                        <tr>
                            <th>Phone:</th>
                            <td>{company.phone}</td>
                        </tr>
                        <tr>
                            <th>Website:</th>
                            <td><a href={company.website} target="_blank" rel="noreferrer">{company.website}</a></td>
                        </tr>
                        <tr>
                            <th>Location:</th>
                            <td>{company.address || company.location}</td>
                        </tr>
                        <tr>
                            <th>Industry:</th>
                            <td>{company.industry || company.category}</td>
                        </tr>
                        <tr>
                            <th>Description:</th>
                            <td>{company.description}</td>
                        </tr>
                        <tr>
                            <th>Created At:</th>
                            <td>{new Date(company.createdAt).toLocaleDateString('en-IN', { dateStyle: 'long' })}</td>
                        </tr>
                    </tbody>
                </table>
            </div>

        </div>
    );
};

export default CompanyDetails;