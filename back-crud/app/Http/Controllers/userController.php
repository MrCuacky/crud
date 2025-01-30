<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Http\Requests\userStoreRequest;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    public function index()
    {
        $users = User::all();

        //return json response
        return response()->json([
            'results' => $users
        ], 200);
    }

    public function store(userStoreRequest $request)
    {
        try {
            $user = User::create([
                'name' => $request->name,
                'email' => $request->email,
                'password' => Hash::make($request->password)
            ]);
            return response()->json($user, 201); // Devuelve el usuario completo
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'User creation failed',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function show($id)
    {
        //user detail
        $users = User::find($id);
        if (!$users){
            return response()->json([
               'message' => 'User not found'
            ], 404);
        }

        return response()->json([
            'users' => $users
         ], 200);
    }

    public function update(UserStoreRequest $request, $id)
    {
        try { 
            $users = User::find($id);
            if (!$users) {
                return response()->json([
                    'message' => 'User not found'
                ], 404);
            }

            $users->name = $request->name;
            $users->email = $request->email;
            $users->save();

            //return json response 
            return response()->json([
                'message' => 'User successfully updated'
            ], 200);   

        } catch (\Exception $e) {
            //return json response 
            return response()->json([
                'message' => 'Something went wrong',
                'error' => $e->getMessage() // Añadir mensaje de error para depuración
            ], 500);
        }
    }

    public function destroy($id)
    {
            $users = User :: find($id);
            if (!$users){
                return response ()-> json([
                    'message'=> 'User not found'
                ],404);
            }

        $users->delete();

        return response()->json([
            'message'=> 'User succesfully deleted'
        ],200);

    }
}
