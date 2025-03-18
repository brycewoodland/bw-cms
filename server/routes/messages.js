const express = require('express');
const router = express.Router();
const sequenceGenerator = require('./sequenceGenerator');
const Message = require('../models/message');

// GET all messages
router.get('/', async (req, res) => {
  try {
    const messages = await Message.find().populate('sender'); // 👈 Populates sender field

    res.status(200).json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ message: 'Fetching messages failed!' });
  }
});

// POST
router.post('/', async (req, res) => {
    const maxMessageId = sequenceGenerator.nextId("messages");

    try {
        const message = new Message({
            id: maxMessageId,
            subject: req.body.subject,
            msgText: req.body.msgText,
            sender: req.body.sender ? new mongoose.Types.ObjectId(req.body.sender) : null // Ensure ObjectId
        });

        const createdMessage = await message.save();
        res.status(201).json({
            message: 'Message added successfully',
            messageData: createdMessage
        });
    } catch (error) {
        console.error('Error adding message:', error);
        res.status(500).json({ message: 'An error occurred', error });
    }
});


// PUT (Update) a message
router.put('/:id', async (req, res) => {
    try {
        const message = await Message.findOne({ id: req.params.id });
        if (!message) {
            return res.status(404).json({ message: 'Message not found.' });
        }

        message.subject = req.body.subject;
        message.msgText = req.body.msgText;
        message.sender = req.body.sender ? new mongoose.Types.ObjectId(req.body.sender) : null;

        await message.save();
        res.status(204).json({ message: 'Message updated successfully' });
    } catch (error) {
        console.error('Error updating message:', error);
        res.status(500).json({ message: 'An error occurred', error });
    }
});


// DELETE a message
router.delete('/:id', (req, res, next) => {
    Message.findOne({ id: req.params.id })
    .then(message => {
        if (!message) {
            return res.status(404).json({ message: 'Message not found.' });
        }

        Message.deleteOne({ id: req.params.id })
            .then(() => {
                res.status(204).json({
                    message: "Message deleted successfully"
                });
            })
            .catch(error => {
                res.status(500).json({
                    message: 'An error occurred',
                    error: error
                });
            });
    })
    .catch(error => {
        res.status(500).json({
            message: 'Message not found.',
            error: { message: 'Message not found' }
        });
    });
});

module.exports = router;
