"use client";

import Image from "next/image";
import axios from 'axios';
import React, {useEffect, useState } from "react";
import '@fortawesome/fontawesome-free/css/all.min.css';

interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  created_at: Date;
}

export default function Home() {
  const [users, setUsers] = useState<User[]>([]);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/api/users')
      .then(response => setUsers(response.data.results))
      .catch(error => console.error('Error fetching users:', error));
  }, []);

  const addUser = async (event: React.FormEvent) => {
    event.preventDefault();
    if (editingUser) {
      // Update existing user
      try {
        const response = await axios.put(`http://127.0.0.1:8000/api/usersupdate/${editingUser.id}`, {
          name: formData.name,
          email: formData.email
        });
        if (response.status === 200) {
          setUsers(users.map(user => user.id === editingUser.id ? { ...user, name: formData.name, email: formData.email } : user));
          setEditingUser(null);
          setFormData({ name: '', email: '', password: '' });
        }
      } catch (error) {
        console.error('Error updating user:', error);
      }
    } else {
      // Add new user
      try {
        const response = await axios.post('http://127.0.0.1:8000/api/addnew', formData);
        if (response.status === 201) {
          setUsers([...users, response.data]);
          setFormData({ name: '', email: '', password: '' });
        }
      } catch (error) {
        console.error('Error adding user:', error);
      }
    }
  };

  const handleEditClick = (user: User) => {
    setEditingUser(user);
    setFormData({ name: user.name, email: user.email, password: '' });
  };

  const deleteUser = async (id: number) => {
    try {
      const userId=id;
      const response = await axios.delete(`http://127.0.0.1:8000/api/usersdelete/${id}`);
      setUsers(users.filter((user) => user.id !== userId));

    } catch (error) {
      console.error('Error deleting user:', error);
    }

  };

  const viewUser = (user: User) => {
    setSelectedUser(user);
  };

  const cleanForm = ()=>{
    setEditingUser(null);
    setFormData({name: '', email: '', password: '' });
  }


  return (
    <div className="min-h-screen bg-[#f0f2f5] p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar */}
          <div className="w-full md:w-96 bg-white rounded-lg shadow-md p-6">
            <h1 className="text-2xl font-roboto font-bold text-gray-800 mb-6">
              User Management
            </h1>
            <form onSubmit={addUser} className="space-y-4">
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="Full Name"
                className="w-full px-4 py-2 text-gray-700 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              />
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                placeholder="Email"
                className="w-full px-4 py-2 text-gray-700 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              />
              <input
                type="password"
                name="password"
                required
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                placeholder="Password"
                className="w-full px-4 py-2 text-gray-700 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                disabled={!!editingUser}
              />
              <button
                type="submit"
                className="w-full bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                {editingUser ? "Update User" : "Add User"}
              </button>
            </form>
          </div>

 {/* User Grid */}
 <div className="flex-1">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {users.map((user) => (
                <div
                  key={user.id}
                  className="bg-white p-6 rounded-lg shadow-md relative group"
                >
                  <div className="space-y-2">
                    <p className="text-gray-600 text-sm">{user.id}</p>
                    <h3 className="font-roboto font-medium text-gray-800">
                      {user.name}
                    </h3>
                    <p className="text-gray-600 text-sm">{user.email}</p>
                    <p className="text-gray-400 text-xs">
                      Created: {new Date(user.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="absolute top-2 right-2 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                      onClick={() => viewUser(user)}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      <i className="fas fa-eye"></i>
                    </button>
                    <button
                      onClick={() => handleEditClick(user)}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      <i className="fas fa-edit"></i>
                    </button>
                    <button
                      onClick={() => deleteUser(user.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                  </div>
                </div>
              ))}
              {/* Add User Button */}
              <button
              onClick={() => cleanForm()}
              className="border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center min-h-[160px] hover:border-gray-400 transition-colors"
            >
              <i className="fas fa-user-plus text-gray-400 text-2xl"></i>
            </button>
            </div>
          </div>
        </div>
      </div>
      {selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full animate-spin-in">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-roboto font-bold text-gray-800">
                User Details
              </h2>
              <button
                onClick={() => setSelectedUser(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-600">Name</label>
                <p className="font-medium text-gray-800">{selectedUser.name}</p>
              </div>
              <div>
                <label className="text-sm text-gray-600">Email</label>
                <p className="font-medium text-gray-800">
                  {selectedUser.email}
                </p>
              </div>
              <div>
                <label className="text-sm text-gray-600">Created At</label>
                <p className="font-medium text-gray-800">
                  {new Date(selectedUser.created_at).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
      <style jsx global>{`
        @keyframes spin-in {
          from {
            transform: rotate(-180deg) scale(0);
            opacity: 0;
          }
          to {
            transform: rotate(0) scale(1);
            opacity: 1;
          }
        }
        .animate-spin-in {
          animation: spin-in 0.5s ease-out;
        }
      `}</style>
    </div>
  );  
}



  {/* <table className="min-w-full bg-black">
            <thead>
              <tr>
                <th className="py-2">ID</th>
                <th className="py-2">Nombre</th>
                <th className="py-2">Email</th>
                <th className="py-2">Fecha de Creacion</th>
              </tr>
            </thead>

            <tbody>
              {users.map((user, index) => (
                <tr key={`${user.id}-${index}`}>
                  <td className="border px-4 py-2">{user.id}</td>
                  <td className="border px-4 py-2">{user.name}</td>
                  <td className="border px-4 py-2">{user.email}</td>
                  <td className="border px-4 py-2">{new Date(user.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table> */}  {/* <table className="min-w-full bg-black">
            <thead>
              <tr>
                <th className="py-2">ID</th>
                <th className="py-2">Nombre</th>
                <th className="py-2">Email</th>
                <th className="py-2">Fecha de Creacion</th>
              </tr>
            </thead>

            <tbody>
              {users.map((user, index) => (
                <tr key={`${user.id}-${index}`}>
                  <td className="border px-4 py-2">{user.id}</td>
                  <td className="border px-4 py-2">{user.name}</td>
                  <td className="border px-4 py-2">{user.email}</td>
                  <td className="border px-4 py-2">{new Date(user.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table> */}
