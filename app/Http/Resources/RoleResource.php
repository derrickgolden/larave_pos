<?php

namespace App\Http\Resources;

class RoleResource extends BaseJsonResource
{
    public function toArray($request): array
    {
        $response = parent::toArray($request); // preserves original structure

        // Attach warehouse_role without altering existing format
        $response['warehouse_role'] = $this->warehouses->map(function ($warehouse) {
            return [
                'id' => $warehouse->id,
                'name' => $warehouse->name, // or whatever fields are relevant
            ];
        });

        return $response;
    }
}