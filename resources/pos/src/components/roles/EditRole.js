import React, {memo, useEffect} from 'react';
import {connect} from 'react-redux';
import {useParams} from 'react-router-dom';
import RoleFrom from './RoleForm';
import {fetchRole} from '../../store/action/roleAction';
import { fetchAllWarehouses } from "../../store/action/warehouseAction";
import MasterLayout from '../MasterLayout';
import HeaderTitle from '../header/HeaderTitle';
import {fetchPermissions} from '../../store/action/permissionAction';
import {getFormattedMessage} from "../../shared/sharedMethod";
import TopProgressBar from "../../shared/components/loaders/TopProgressBar";
import Spinner from "../../shared/components/loaders/Spinner";

const EditRole = (props) => {
    const {roles, fetchRole, fetchPermissions, isLoading, permissions, warehouses,
        fetchAllWarehouses,} = props;
    const {id} = useParams();

    const itemsValue = roles.length === 1 && roles.map((role) => ({
        name: role.attributes.name,
        permissions: role.attributes.permissions
    }));

    useEffect(() => {
        fetchAllWarehouses();
        fetchPermissions();
        fetchRole(id)
    }, []);

    const preparePermissions = (permissions, selectedPermission) => {
        let permissionArray = [];
        permissions.length !== 0 && permissions.forEach(permission => {
            const perm = selectedPermission && selectedPermission.find(perm => perm.id === permission.id);
            let selected = false;
            if (perm) {
                selected = true;
            }
            permissionArray.push({
                id: permission.id,
                name: permission.attributes.display_name,
                selected,
                isChecked: selected
            })
        });
        return permissionArray;
    };

    const newPermission = roles[0] && roles[0].attributes && preparePermissions(permissions, roles[0].attributes.permissions)

    const newArray = warehouses.map((warehouse) => ({label: warehouse.attributes.name, value: warehouse.id}));

    return (
        <MasterLayout>
            <TopProgressBar/>
            <HeaderTitle title={getFormattedMessage("role.edit.title")} to='/app/roles'/>
            {isLoading ? <Spinner />:
                roles.length === 1 && newPermission && 
                <RoleFrom singleRole={itemsValue[0]} id={id} permissionsArray={newPermission} newArray={newArray}/>
            }
        </MasterLayout>
    );
};

const mapStateToProps = (state) => {
    const {roles, permissions, isLoading, warehouses} = state;
    return {
        roles,
        permissions,
        // newPermission: roles.length === 1 && roles[0] && roles[0].attributes && preparePermissions(permissions, roles[0].attributes.permissions),
        isLoading,
        warehouses
    }
};

export default connect(mapStateToProps, {fetchRole, fetchPermissions, fetchAllWarehouses})(memo(EditRole));
