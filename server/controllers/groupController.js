const Group = require('../models/Group');
const User = require('../models/User');
const mongoose = require('mongoose');

// Create a new group
const createGroup = async (req, res) => {
    try {
        const { name, description, members } = req.body;
        const admin = req.user._id;

        // Validate member IDs first
        let validMembers = [];
        if (members && members.length > 0) {
            // Check if all member IDs are valid ObjectIds and exist in database
            validMembers = await User.find({
                _id: { $in: members.filter(id => mongoose.Types.ObjectId.isValid(id)) }
            }).select('_id');
        }

        // Create group with validated members
        const group = await Group.create({
            name,
            description,
            admin: [admin],
            members: validMembers.map(member => ({
                user: member._id,
                role: 'member'  ,
                joinedAt: new Date()
            }))
        });

        // Fetch the created group with populated fields
        const populatedGroup = await Group.findById(group._id)
            .populate('admin', 'name profilePicture')
            .populate('members.user', 'name profilePicture');

        res.status(201).json({
            success: true,
            data: populatedGroup
        });

    } catch (error) {
        console.error('Error creating group:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get group details
const getGroup = async (req, res) => {
    try {
        const { groupId } = req.params;

        const group = await Group.findById(groupId)
            .populate('admin', 'name profilePicture')
            .populate('members.user', 'name profilePicture');

        if (!group) {
            return res.status(404).json({
                success: false,
                message: 'Group not found'
            });
        }
        const formattedGroup = {
            _id: group._id,
            name: group.name,
            description: group.description,
            admin: group.admin.map(admin => ({
                _id: admin._id,
                name: admin.name,
                profilePicture: admin.profilePicture
            })),
            members: group.members.map(member => ({
                role: member.role,
                _id: member._id,
                user: member.user ? {
                    _id: member.user._id,
                    name: member.user.name,
                    profilePicture: member.user.profilePicture
                } : null,
                joinedAt: member.joinedAt
            })),
            image: group.image,
            isActive: group.isActive,
            messages: group.messages,
            lastActivity: group.lastActivity,
            createdAt: group.createdAt,
            updatedAt: group.updatedAt
        };

        res.status(200).json({
            success: true,
            data: formattedGroup
        });

    } catch (error) {
        console.error('Error fetching group:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Update group
const updateGroup = async (req, res) => {
    try {
        const { groupId } = req.params;
        const { name, description, image } = req.body;
        const userId = req.user._id;

        const group = await Group.findById(groupId);

        if (!group) {
            return res.status(404).json({
                success: false,
                message: 'Group not found'
            });
        }

        // Check if user is admin
        if (group.admin.toString() !== userId.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Only admin can update group'
            });
        }

        const updatedGroup = await Group.findByIdAndUpdate(
            groupId,
            { name, description, image },
            { new: true }
        )
        .populate('admin', 'name profilePicture')
        .populate('members', 'name profilePicture');

        res.status(200).json({
            success: true,
            data: updatedGroup
        });

    } catch (error) {
        console.error('Error updating group:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Delete group
const deleteGroup = async (req, res) => {
    try {
        const { groupId } = req.params;
        const userId = req.user._id;

        const group = await Group.findById(groupId);

        if (!group) {
            return res.status(404).json({
                success: false,
                message: 'Group not found'
            });
        }

        // Check if user is admin
        if (group.admin.toString() !== userId.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Only admin can delete group'
            });
        }

        await Group.findByIdAndDelete(groupId);

        res.status(200).json({
            success: true,
            message: 'Group deleted successfully'
        });

    } catch (error) {
        console.error('Error deleting group:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Send message in group
const sendGroupMessage = async (req, res) => {
    try {
        const { groupId } = req.params;
        const { content } = req.body;
        const userId = req.user._id;
        // console.log('userId', userId);

        const group = await Group.findById(groupId);

        if (!group) {
            return res.status(404).json({
                success: false,
                message: 'Group not found'
            });
        }

        // Check if user is member
        // if (!group.members.includes(userId)) {
        //     return res.status(403).json({
        //         success: false,
        //         message: 'Only members can send messages'
        //     });
        // }

        // Add message to group
        group.messages.push({
            sender: userId,
            content
        });

        await group.save();

        // Get last message with populated sender
        const lastMessage = group.messages[group.messages.length - 1];
        await Group.populate(lastMessage, {
            path: 'sender',
            select: 'name profilePicture'
        });

        res.status(200).json({
            success: true,
            data: lastMessage
        });

    } catch (error) {
        console.error('Error sending message:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Add member to group
const addMember = async (req, res) => {
    try {
        const { groupId } = req.params;
        const { userId } = req.body;
        const adminId = req.user._id;

        // First check if the user exists

        const userToAdd = await User.findById(userId);
        console.log('userToAdd', userToAdd);
        console.log('userId', userId);
        if (!userToAdd) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        const group = await Group.findById(groupId);
        if (!group) {
            return res.status(404).json({
                success: false,
                message: 'Group not found'
            });
        }

        // Check if user is admin
        if (!group.admin.includes(adminId)) {
            return res.status(403).json({
                success: false,
                message: 'Only admin can add members'
            });
        }

        // Check if user is already a member
        const isAlreadyMember = group.members.some(member => 
            member.user && member.user.toString() === userId.toString()
        );

        if (isAlreadyMember) {
            return res.status(400).json({
                success: false,
                message: 'User is already a member of this group'
            });
        }

        // Add new member
        group.members.push({
            user: userId,
            role: 'member',
            joinedAt: new Date()
        });

        await group.save();

        // Fetch updated group with populated fields
        const updatedGroup = await Group.findById(groupId)
            .populate('admin', 'name profilePicture')
            .populate('members.user', 'name profilePicture');

        res.status(200).json({
            success: true,
            data: updatedGroup
        });

    } catch (error) {
        console.error('Error adding member:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Remove member from group
const removeMember = async (req, res) => {
    try {
        const { groupId, userId } = req.params;
        const adminId = req.user._id;

        // console.log('adminId', adminId);
        // console.log('userId', userId);  
        // console.log('groupId', groupId);

        const group = await Group.findById(groupId);

        if (!group) {
            return res.status(404).json({
                success: false,
                message: 'Group not found'
            });
        }

        // Check if user is admin
        if (group.admin.toString() !== adminId.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Only admin can remove members'
            });
        }

        // Remove member
        group.members = group.members.filter(
            member => member.user.toString() !== userId.toString()
        );
        
        await group.save();

        const updatedGroup = await Group.findById(groupId)
            .populate('admin', 'name profilePicture')
            .populate('members', 'name profilePicture');

        res.status(200).json({
            success: true,
            data: updatedGroup
        });

    } catch (error) {
        console.error('Error removing member:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get all groups
const getAllGroups = async (req, res) => {
    try {
        const groups = await Group.find({ isActive: true })
            .populate('members.user', 'name profilePicture')
            .populate('admin', 'name profilePicture')
            .select('-messages') // Exclude messages for better performance
            .sort({ lastActivity: -1 });

        // Format the response
        const formattedGroups = groups.map(group => ({
            _id: group._id,
            name: group.name,
            description: group.description,
            admin: group.admin.map(admin => ({
                _id: admin._id,
                name: admin.name,
                profilePicture: admin.profilePicture
            })),
            members: group.members.map(member => ({
                role: member.role,
                _id: member._id,
                user: member.user ? {
                    _id: member.user._id,
                    name: member.user.name,
                    profilePicture: member.user.profilePicture
                } : null,
                joinedAt: member.joinedAt
            })),
            image: group.image,
            isActive: group.isActive,
            lastActivity: group.lastActivity,
            createdAt: group.createdAt,
            updatedAt: group.updatedAt
        }));

        res.status(200).json({
            success: true,
            count: formattedGroups.length,
            data: formattedGroups
        });

    } catch (error) {
        console.error('Error fetching groups:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};



// Get group messages with pagination
const getGroupMessages = async (req, res) => {
    try {
        const { groupId } = req.params;
        const { page = 1, limit = 50 } = req.query;
        const userId = req.user._id;

        const group = await Group.findOne({
            _id: groupId,
            'members.user': userId,
            isActive: true
        });

        if (!group) {
            return res.status(404).json({
                success: false,
                message: 'Group not found or access denied'
            });
        }

        const messages = await Group.findById(groupId)
            .select('messages')
            .populate('messages.sender', 'name profilePicture')
            .populate('messages.readBy.user', 'name')
            .slice('messages', [(page - 1) * limit, limit])
            .sort({ 'messages.createdAt': -1 });

        res.status(200).json({
            success: true,
            data: messages.messages,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total: group.messages.length
            }
        });

    } catch (error) {
        console.error('Error fetching group messages:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Mark messages as read
const markMessagesAsRead = async (req, res) => {
    try {
        const { groupId } = req.params;
        const userId = req.user._id;

        const group = await Group.findOne({
            _id: groupId,
            'members.user': userId
        });

        if (!group) {
            return res.status(404).json({
                success: false,
                message: 'Group not found or access denied'
            });
        }

        // Mark all unread messages as read
        const updateResult = await Group.updateMany(
            {
                _id: groupId,
                'messages.readBy.user': { $ne: userId }
            },
            {
                $addToSet: {
                    'messages.$[].readBy': {
                        user: userId,
                        readAt: new Date()
                    }
                }
            }
        );

        res.status(200).json({
            success: true,
            message: 'Messages marked as read',
            updatedCount: updateResult.modifiedCount
        });

    } catch (error) {
        console.error('Error marking messages as read:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Make user admin
const makeUserAdmin = async (req, res) => {
    try {
        const { groupId, userId } = req.params;
        const adminId = req.user._id;

        const group = await Group.findById(groupId);

        if (!group) {
            return res.status(404).json({
                success: false,
                message: 'Group not found'
            });
        }

        // Check if requester is admin
        if (!group.admin.includes(adminId)) {
            return res.status(403).json({
                success: false,
                message: 'Only admins can promote members'
            });
        }

        // Update member role to admin
        await Group.updateOne(
            { 
                _id: groupId,
                'members.user': userId
            },
            {
                $set: { 'members.$.role': 'admin' },
                $addToSet: { admin: userId }
            }
        );

        const updatedGroup = await Group.findById(groupId)
            .populate('members.user', 'name profilePicture')
            .populate('admin', 'name profilePicture');

        res.status(200).json({
            success: true,
            data: updatedGroup
        });

    } catch (error) {
        console.error('Error making user admin:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Leave group
const leaveGroup = async (req, res) => {
    try {
        const { groupId } = req.params;
        const userId = req.user._id;

        const group = await Group.findById(groupId);

        if (!group) {
            return res.status(404).json({
                success: false,
                message: 'Group not found'
            });
        }

        // Remove user from members and admin arrays
        await Group.updateOne(
            { _id: groupId },
            {
                $pull: {
                    members: { user: userId },
                    admin: userId
                }
            }
        );

        res.status(200).json({
            success: true,
            message: 'Successfully left the group'
        });

    } catch (error) {
        console.error('Error leaving group:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    createGroup,
    getGroup,
    updateGroup,
    deleteGroup,
    sendGroupMessage,
    addMember,
    removeMember,
    getAllGroups,
    getGroupMessages,
    markMessagesAsRead,
    makeUserAdmin,
    leaveGroup
};
