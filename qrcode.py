import cv2
import barcode
from barcode.writer import ImageWriter
from pyzbar import pyzbar

CODE128 = barcode.get_barcode_class('code128')

# or sure, to an actual file:
# with open('somefile.png', 'wb') as f:
#    CODE128('I Love You', writer=ImageWriter()).write(f)

def detect_and_decode(img):
	barcodes = pyzbar.decode(img)

	rects = []
	data = []
	types = []
	for barcode in barcodes:
		(x, y, w, h) = barcode.rect
		barcodeData = barcode.data.decode('utf-8')
		barcodeType = barcode.type 

		rects.append((x, y, w, h))
		data.append(barcodeData)
		types.append(barcodeType)

	return rects, data, types