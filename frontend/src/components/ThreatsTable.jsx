import React from 'react';

export default function ThreatsTable() {
    const dummy_threats = [
        { id: 1, host: "cat.com", url: "https://cat.com", threatType: "catSteal", dateAdded: "2024-02-10" },
        { id: 1, host: "dog.com", url: "https://dog.com", threatType: "dogAttack", dateAdded: "2024-02-10" }
    ]
    
    return (
        <div>
            <table>
                <thead>
                    <tr>
                        <th>Host</th>
                        <th>URL</th>
                        <th>Threat Type</th>
                        <th>Date Added</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        dummy_threats.map(item => (
                            <tr key={item.id}>
                                <td>{item.host}</td>
                                <td>{item.url}</td>
                                <td>{item.threatType}</td>
                                <td>{item.dateAdded}</td>
                            </tr>
                        ))
                    }
                </tbody>
            </table>
        </div>
    );
}