<?php

namespace App\Repositories;

use App\Models\Role;
use Exception;
use Illuminate\Support\Facades\DB;
use Symfony\Component\HttpKernel\Exception\UnprocessableEntityHttpException;

/**
 * Class RoleRepository
 */
class RoleRepository extends BaseRepository
{
    /**
     * @var array
     */
    protected $fieldSearchable = [
        'name',
        'display_name',
        'created_at',
    ];

    /**
     * Return searchable fields
     */
    public function getFieldsSearchable(): array
    {
        return $this->fieldSearchable;
    }

    /**
     * Configure the Model
     **/
    public function model()
    {
        return Role::class;
    }

    /**
     * @return \Illuminate\Database\Eloquent\Builder|\Illuminate\Database\Eloquent\Model
     */
    public function storeRole($input)
    {
        try {
            DB::beginTransaction();

            $input['display_name'] = $input['name'];

            /** @var Role $role */
            $role = Role::create($input);

            // Assign permissions
            if (!empty($input['permissions'])) {
                $role->givePermissionTo($input['permissions']);
            }

            // Sync warehouses
            if (!empty($input['warehouses'])) {
                $role->warehouses()->sync($input['warehouses']);
            }

            DB::commit();

            return $role->load(['permissions', 'warehouses']); // Optional eager load
        } catch (Exception $exception) {
            DB::rollBack();
            throw new \Symfony\Component\HttpKernel\Exception\UnprocessableEntityHttpException($exception->getMessage());
        }
    }


    /**
     * @return mixed
     */
    public function updateRole($input, $id)
    {
        try {
            DB::beginTransaction();

            $input['display_name'] = $input['name'];

            /** @var Role $role */
            $role = Role::findOrFail($id);

            // Update role fields
            $role->update($input);

            // Sync permissions
            if (isset($input['permissions'])) {
                $role->syncPermissions($input['permissions']);
            }

            // Sync warehouses if provided
            if (isset($input['warehouses'])) {
                $role->warehouses()->sync($input['warehouses']); // Timestamps will be recorded if ->withTimestamps() is set in the Role model
            }

            DB::commit();
            return $role;

        } catch (Exception $exception) {
            DB::rollBack();
            throw new UnprocessableEntityHttpException($exception->getMessage());
        }
    }

}
